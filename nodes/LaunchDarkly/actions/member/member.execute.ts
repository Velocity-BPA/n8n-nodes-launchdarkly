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
} from '../../transport/launchDarklyApi';
import { parseUserKeys } from '../../utils/helpers';

export async function inviteMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const email = this.getNodeParameter('email', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const memberData: IDataObject = {
		email,
	};

	if (additionalFields.role) {
		memberData.role = additionalFields.role;
	}

	if (additionalFields.firstName) {
		memberData.firstName = additionalFields.firstName;
	}

	if (additionalFields.lastName) {
		memberData.lastName = additionalFields.lastName;
	}

	if (additionalFields.customRoles) {
		memberData.customRoles = parseUserKeys(additionalFields.customRoles as string);
	}

	const body = [memberData];

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		'/members',
		body as unknown as IDataObject,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const memberId = this.getNodeParameter('memberId', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/members/${memberId}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.filter) {
		query.filter = filters.filter;
	}

	if (filters.team) {
		query.team = filters.team;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			'/members',
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			'/members',
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const memberId = this.getNodeParameter('memberId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations: IDataObject[] = [];

	if (updateFields.role) {
		operations.push({
			op: 'replace',
			path: '/role',
			value: updateFields.role,
		});
	}

	if (updateFields.customRoles) {
		operations.push({
			op: 'replace',
			path: '/customRoles',
			value: parseUserKeys(updateFields.customRoles as string),
		});
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/members/${memberId}`,
		operations as any,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteMember(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const memberId = this.getNodeParameter('memberId', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/members/${memberId}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: memberId });
}
