/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { launchDarklyApiRequest } from '../../transport/launchDarklyApi';

export async function getUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const userKey = this.getNodeParameter('userKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/users/${projectKey}/${environmentKey}/${userKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function searchUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.q) {
		query.q = filters.q;
	}

	if (filters.searchAfter) {
		query.searchAfter = filters.searchAfter;
	}

	const returnData: IDataObject[] = [];

	if (returnAll) {
		let hasMore = true;
		query.limit = 20;

		while (hasMore) {
			const result = await launchDarklyApiRequest.call(
				this,
				'GET',
				`/users/${projectKey}/${environmentKey}`,
				{},
				query,
			);

			const items = (result as IDataObject).items as IDataObject[];
			if (items && items.length > 0) {
				returnData.push(...items);
				
				// Check for next page
				const links = (result as IDataObject)._links as IDataObject;
				if (links && links.next) {
					const nextLink = (links.next as IDataObject).href as string;
					// Extract searchAfter from the next link
					const searchAfterMatch = nextLink.match(/searchAfter=([^&]+)/);
					if (searchAfterMatch) {
						query.searchAfter = searchAfterMatch[1];
					} else {
						hasMore = false;
					}
				} else {
					hasMore = false;
				}
			} else {
				hasMore = false;
			}
		}
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			`/users/${projectKey}/${environmentKey}`,
			{},
			query,
		);
		const items = (result as IDataObject).items as IDataObject[];
		if (items) {
			returnData.push(...items);
		}
	}

	return this.helpers.returnJsonArray(returnData);
}

export async function deleteUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const userKey = this.getNodeParameter('userKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/users/${projectKey}/${environmentKey}/${userKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: userKey });
}
