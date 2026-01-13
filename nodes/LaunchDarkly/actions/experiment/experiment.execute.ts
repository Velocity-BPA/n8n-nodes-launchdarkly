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

export async function createExperiment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const experimentKey = this.getNodeParameter('experimentKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const hypothesis = this.getNodeParameter('hypothesis', index) as string;
	const primaryMetricKey = this.getNodeParameter('primaryMetricKey', index) as string;
	const treatmentsRaw = this.getNodeParameter('treatments', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const treatments = parseJsonParameter(treatmentsRaw);

	const iteration: IDataObject = {
		hypothesis,
		canReshuffleTraffic: true,
		primaryMetric: {
			key: primaryMetricKey,
		},
		treatments,
	};

	if (additionalFields.secondaryMetrics) {
		const metricKeys = (additionalFields.secondaryMetrics as string)
			.split(',')
			.map((k) => k.trim())
			.filter((k) => k);
		iteration.secondaryMetrics = metricKeys.map((key) => ({ key }));
	}

	if (additionalFields.randomizationUnit) {
		iteration.randomizationUnit = additionalFields.randomizationUnit;
	}

	const body: IDataObject = {
		key: experimentKey,
		name,
		iteration,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	if (additionalFields.maintainerId) {
		body.maintainerId = additionalFields.maintainerId;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/projects/${projectKey}/environments/${environmentKey}/experiments`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getExperiment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const experimentKey = this.getNodeParameter('experimentKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/projects/${projectKey}/environments/${environmentKey}/experiments/${experimentKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyExperiments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.status) {
		query.status = filters.status;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			`/projects/${projectKey}/environments/${environmentKey}/experiments`,
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			`/projects/${projectKey}/environments/${environmentKey}/experiments`,
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateExperiment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const experimentKey = this.getNodeParameter('experimentKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations = [];

	if (updateFields.name) {
		operations.push(buildPatchOperation('replace', '/name', updateFields.name));
	}

	if (updateFields.description !== undefined) {
		operations.push(buildPatchOperation('replace', '/description', updateFields.description));
	}

	if (updateFields.maintainerId) {
		operations.push(buildPatchOperation('replace', '/maintainerId', updateFields.maintainerId));
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/projects/${projectKey}/environments/${environmentKey}/experiments/${experimentKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}
