/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import {
	launchDarklyApiRequest,
	launchDarklyApiRequestAllItems,
	launchDarklyPatchRequest,
	buildPatchOperation,
	parseJsonParameter,
} from '../../transport/launchDarklyApi';
import { parseTags } from '../../utils/helpers';

export async function createMetric(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const metricKey = this.getNodeParameter('metricKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const kind = this.getNodeParameter('kind', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: metricKey,
		name,
		kind,
	};

	// Handle kind-specific fields
	if (kind === 'custom') {
		body.eventKey = this.getNodeParameter('eventKey', index) as string;
	} else if (kind === 'click') {
		body.selector = this.getNodeParameter('selector', index) as string;
		const urlsRaw = this.getNodeParameter('urls', index) as string;
		if (urlsRaw) {
			body.urls = parseJsonParameter(urlsRaw);
		}
	} else if (kind === 'pageview') {
		const urlsRaw = this.getNodeParameter('urls', index) as string;
		if (urlsRaw) {
			body.urls = parseJsonParameter(urlsRaw);
		}
	}

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	if (additionalFields.isNumeric !== undefined) {
		body.isNumeric = additionalFields.isNumeric;
	}

	if (additionalFields.unit) {
		body.unit = additionalFields.unit;
	}

	if (additionalFields.successCriteria) {
		body.successCriteria = additionalFields.successCriteria;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/metrics/${projectKey}`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMetric(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const metricKey = this.getNodeParameter('metricKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/metrics/${projectKey}/${metricKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyMetrics(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			`/metrics/${projectKey}`,
			{},
			{},
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			`/metrics/${projectKey}`,
			{},
			{ limit },
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateMetric(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const metricKey = this.getNodeParameter('metricKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations = [];

	if (updateFields.name) {
		operations.push(buildPatchOperation('replace', '/name', updateFields.name));
	}

	if (updateFields.description !== undefined) {
		operations.push(buildPatchOperation('replace', '/description', updateFields.description));
	}

	if (updateFields.tags) {
		const tags = parseTags(updateFields.tags as string);
		operations.push(buildPatchOperation('replace', '/tags', tags));
	}

	if (updateFields.isNumeric !== undefined) {
		operations.push(buildPatchOperation('replace', '/isNumeric', updateFields.isNumeric));
	}

	if (updateFields.unit !== undefined) {
		operations.push(buildPatchOperation('replace', '/unit', updateFields.unit));
	}

	if (updateFields.successCriteria) {
		operations.push(buildPatchOperation('replace', '/successCriteria', updateFields.successCriteria));
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/metrics/${projectKey}/${metricKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteMetric(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const metricKey = this.getNodeParameter('metricKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/metrics/${projectKey}/${metricKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: metricKey });
}
