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
} from '../../transport/launchDarklyApi';
import { parseTags } from '../../utils/helpers';

export async function createSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: segmentKey,
		name,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	if (additionalFields.included) {
		body.included = (additionalFields.included as string).split(',').map((s) => s.trim());
	}

	if (additionalFields.excluded) {
		body.excluded = (additionalFields.excluded as string).split(',').map((s) => s.trim());
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/segments/${projectKey}/${environmentKey}`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManySegments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.tag) {
		query.tag = filters.tag;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			`/segments/${projectKey}/${environmentKey}`,
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			`/segments/${projectKey}/${environmentKey}`,
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;
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

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: segmentKey });
}

export async function addUsersToSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;
	const userKeysString = this.getNodeParameter('userKeys', index) as string;
	const targetType = this.getNodeParameter('targetType', index) as string;

	const userKeys = userKeysString.split(',').map((s) => s.trim()).filter((s) => s);

	const operations = userKeys.map((userKey) =>
		buildPatchOperation('add', `/${targetType}/-`, userKey),
	);

	const response = await launchDarklyPatchRequest.call(
		this,
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function removeUsersFromSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const segmentKey = this.getNodeParameter('segmentKey', index) as string;
	const userKeysString = this.getNodeParameter('userKeys', index) as string;
	const targetType = this.getNodeParameter('targetType', index) as string;

	const userKeys = userKeysString.split(',').map((s) => s.trim()).filter((s) => s);

	// First get the current segment to find user indices
	const segment = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
	) as IDataObject;

	const currentUsers = (segment[targetType] as string[]) || [];
	
	// Build remove operations - need to remove from end to beginning to maintain indices
	const indicesToRemove: number[] = [];
	for (const userKey of userKeys) {
		const idx = currentUsers.indexOf(userKey);
		if (idx !== -1) {
			indicesToRemove.push(idx);
		}
	}

	// Sort descending to remove from end first
	indicesToRemove.sort((a, b) => b - a);

	const operations = indicesToRemove.map((idx) =>
		buildPatchOperation('remove', `/${targetType}/${idx}`),
	);

	if (operations.length === 0) {
		return this.helpers.returnJsonArray({ success: true, message: 'No matching users found to remove' });
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/segments/${projectKey}/${environmentKey}/${segmentKey}`,
		operations,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}
