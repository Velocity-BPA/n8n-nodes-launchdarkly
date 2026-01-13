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
} from '../../transport/launchDarklyApi';

export async function getAuditLogEntry(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const entryId = this.getNodeParameter('entryId', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/auditlog/${entryId}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyAuditLogEntries(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.before) {
		const beforeDate = new Date(filters.before as string);
		query.before = beforeDate.getTime();
	}

	if (filters.after) {
		const afterDate = new Date(filters.after as string);
		query.after = afterDate.getTime();
	}

	if (filters.q) {
		query.q = filters.q;
	}

	if (filters.spec) {
		query.spec = filters.spec;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			'/auditlog',
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			'/auditlog',
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}
