/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { IPatchOperation } from '../types/LaunchDarklyTypes';

const BASE_URL = 'https://app.launchdarkly.com/api/v2';

export async function launchDarklyApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	headers?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('launchDarklyApi');

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Authorization: credentials.accessToken as string,
			'Content-Type': 'application/json',
			...headers,
		},
		qs: query,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error: unknown) {
		const err = error as { message?: string; description?: string };
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Unknown error',
			description: err.description,
		});
	}
}

export async function launchDarklyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	propertyName = 'items',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData: IDataObject;
	query = query || {};
	query.limit = query.limit || 20;
	query.offset = 0;

	do {
		responseData = await launchDarklyApiRequest.call(this, method, endpoint, body, query);
		const items = responseData[propertyName] as IDataObject[] | undefined;
		if (items) {
			returnData.push(...items);
		}
		query.offset = (query.offset as number) + (query.limit as number);
	} while (
		responseData.totalCount &&
		returnData.length < (responseData.totalCount as number)
	);

	return returnData;
}

export async function launchDarklyPatchRequest(
	this: IExecuteFunctions,
	endpoint: string,
	operations: IPatchOperation[],
): Promise<IDataObject> {
	const credentials = await this.getCredentials('launchDarklyApi');

	const options: IRequestOptions = {
		method: 'PATCH',
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Authorization: credentials.accessToken as string,
			'Content-Type': 'application/json',
		},
		body: operations,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error: unknown) {
		const err = error as { message?: string; description?: string };
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Unknown error',
			description: err.description,
		});
	}
}

export async function launchDarklySemanticPatchRequest(
	this: IExecuteFunctions,
	endpoint: string,
	instructions: IDataObject[],
	comment?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('launchDarklyApi');

	const body: IDataObject = {
		instructions,
	};

	if (comment) {
		body.comment = comment;
	}

	const options: IRequestOptions = {
		method: 'PATCH',
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Authorization: credentials.accessToken as string,
			'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
		},
		body,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error: unknown) {
		const err = error as { message?: string; description?: string };
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Unknown error',
			description: err.description,
		});
	}
}

export function buildPatchOperation(
	op: IPatchOperation['op'],
	path: string,
	value?: unknown,
): IPatchOperation {
	const operation: IPatchOperation = { op, path };
	if (value !== undefined) {
		operation.value = value;
	}
	return operation;
}

export function parseJsonParameter(value: string | object): object {
	if (typeof value === 'object') {
		return value;
	}
	try {
		return JSON.parse(value);
	} catch {
		throw new Error(`Invalid JSON: ${value}`);
	}
}

export function simplifyResponse(response: IDataObject): IDataObject {
	const simplified: IDataObject = {};
	
	for (const [key, value] of Object.entries(response)) {
		if (key.startsWith('_') && key !== '_id') {
			continue;
		}
		simplified[key] = value;
	}
	
	return simplified;
}
