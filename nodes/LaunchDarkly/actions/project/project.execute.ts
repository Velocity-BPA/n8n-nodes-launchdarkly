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

export async function createProject(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: projectKey,
		name,
	};

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	if (additionalFields.includeInSnippetByDefault !== undefined) {
		body.includeInSnippetByDefault = additionalFields.includeInSnippetByDefault;
	}

	if (additionalFields.defaultClientSideAvailability) {
		const csa = (additionalFields.defaultClientSideAvailability as IDataObject).availability as IDataObject;
		if (csa) {
			body.defaultClientSideAvailability = csa;
		}
	}

	if (additionalFields.environments) {
		const environments = parseJsonParameter(additionalFields.environments as string);
		body.environments = environments;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		'/projects',
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getProject(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/projects/${projectKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyProjects(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.query) {
		query.query = filters.query;
	}
	if (filters.tag) {
		query.tag = filters.tag;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			'/projects',
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			'/projects',
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateProject(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations = [];

	if (updateFields.name) {
		operations.push(buildPatchOperation('replace', '/name', updateFields.name));
	}

	if (updateFields.tags) {
		const tags = parseTags(updateFields.tags as string);
		operations.push(buildPatchOperation('replace', '/tags', tags));
	}

	if (updateFields.includeInSnippetByDefault !== undefined) {
		operations.push(buildPatchOperation('replace', '/includeInSnippetByDefault', updateFields.includeInSnippetByDefault));
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/projects/${projectKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteProject(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/projects/${projectKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: projectKey });
}
