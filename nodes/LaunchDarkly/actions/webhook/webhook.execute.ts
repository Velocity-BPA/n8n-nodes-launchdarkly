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
} from '../../transport/launchDarklyApi';
import { parseTags } from '../../utils/helpers';

export async function createWebhook(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		url,
		name,
	};

	if (additionalFields.on !== undefined) {
		body.on = additionalFields.on;
	}

	if (additionalFields.sign !== undefined) {
		body.sign = additionalFields.sign;
	}

	if (additionalFields.secret) {
		body.secret = additionalFields.secret;
	}

	if (additionalFields.statements) {
		body.statements = typeof additionalFields.statements === 'string'
			? JSON.parse(additionalFields.statements)
			: additionalFields.statements;
	}

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		'/webhooks',
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getWebhook(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter('webhookId', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/webhooks/${webhookId}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyWebhooks(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		'/webhooks',
	);

	let items = (response as IDataObject).items as IDataObject[] || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index) as number;
		items = items.slice(0, limit);
	}

	return this.helpers.returnJsonArray(items);
}

export async function updateWebhook(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter('webhookId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations: IDataObject[] = [];

	if (updateFields.name !== undefined) {
		operations.push({
			op: 'replace',
			path: '/name',
			value: updateFields.name,
		});
	}

	if (updateFields.url !== undefined) {
		operations.push({
			op: 'replace',
			path: '/url',
			value: updateFields.url,
		});
	}

	if (updateFields.on !== undefined) {
		operations.push({
			op: 'replace',
			path: '/on',
			value: updateFields.on,
		});
	}

	if (updateFields.sign !== undefined) {
		operations.push({
			op: 'replace',
			path: '/sign',
			value: updateFields.sign,
		});
	}

	if (updateFields.secret !== undefined) {
		operations.push({
			op: 'replace',
			path: '/secret',
			value: updateFields.secret,
		});
	}

	if (updateFields.statements) {
		const statements = typeof updateFields.statements === 'string'
			? JSON.parse(updateFields.statements)
			: updateFields.statements;
		operations.push({
			op: 'replace',
			path: '/statements',
			value: statements,
		});
	}

	if (updateFields.tags) {
		operations.push({
			op: 'replace',
			path: '/tags',
			value: parseTags(updateFields.tags as string),
		});
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/webhooks/${webhookId}`,
		operations as any,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteWebhook(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const webhookId = this.getNodeParameter('webhookId', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/webhooks/${webhookId}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: webhookId });
}
