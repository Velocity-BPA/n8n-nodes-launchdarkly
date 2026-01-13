/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import {
	launchDarklyApiRequest,
	launchDarklyPatchRequest,
	buildPatchOperation,
} from '../../transport/launchDarklyApi';
import { parseTags } from '../../utils/helpers';

export async function createEnvironment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const color = this.getNodeParameter('color', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: environmentKey,
		name,
		color: color.replace('#', ''),
	};

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	if (additionalFields.defaultTtl !== undefined) {
		body.defaultTtl = additionalFields.defaultTtl;
	}

	if (additionalFields.secureMode !== undefined) {
		body.secureMode = additionalFields.secureMode;
	}

	if (additionalFields.defaultTrackEvents !== undefined) {
		body.defaultTrackEvents = additionalFields.defaultTrackEvents;
	}

	if (additionalFields.requireComments !== undefined) {
		body.requireComments = additionalFields.requireComments;
	}

	if (additionalFields.confirmChanges !== undefined) {
		body.confirmChanges = additionalFields.confirmChanges;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/projects/${projectKey}/environments`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getEnvironment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/projects/${projectKey}/environments/${environmentKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyEnvironments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	// Get the project which includes environments
	const project = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/projects/${projectKey}`,
	) as IDataObject;

	let environments = (project.environments as IDataObject[]) || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index) as number;
		environments = environments.slice(0, limit);
	}

	return this.helpers.returnJsonArray(environments);
}

export async function updateEnvironment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations = [];

	if (updateFields.name) {
		operations.push(buildPatchOperation('replace', '/name', updateFields.name));
	}

	if (updateFields.color) {
		operations.push(buildPatchOperation('replace', '/color', (updateFields.color as string).replace('#', '')));
	}

	if (updateFields.tags) {
		const tags = parseTags(updateFields.tags as string);
		operations.push(buildPatchOperation('replace', '/tags', tags));
	}

	if (updateFields.defaultTtl !== undefined) {
		operations.push(buildPatchOperation('replace', '/defaultTtl', updateFields.defaultTtl));
	}

	if (updateFields.secureMode !== undefined) {
		operations.push(buildPatchOperation('replace', '/secureMode', updateFields.secureMode));
	}

	if (updateFields.defaultTrackEvents !== undefined) {
		operations.push(buildPatchOperation('replace', '/defaultTrackEvents', updateFields.defaultTrackEvents));
	}

	if (updateFields.requireComments !== undefined) {
		operations.push(buildPatchOperation('replace', '/requireComments', updateFields.requireComments));
	}

	if (updateFields.confirmChanges !== undefined) {
		operations.push(buildPatchOperation('replace', '/confirmChanges', updateFields.confirmChanges));
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/projects/${projectKey}/environments/${environmentKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteEnvironment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/projects/${projectKey}/environments/${environmentKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: environmentKey });
}

export async function resetSDKKey(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const expiry = this.getNodeParameter('expiry', index, 0) as number;

	const query: IDataObject = {};
	if (expiry > 0) {
		query.expiry = expiry;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/projects/${projectKey}/environments/${environmentKey}/apiKey`,
		{},
		query,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}
