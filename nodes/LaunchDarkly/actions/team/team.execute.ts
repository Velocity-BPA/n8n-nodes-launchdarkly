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

export async function createTeam(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: teamKey,
		name,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	if (additionalFields.memberIDs) {
		body.memberIDs = parseUserKeys(additionalFields.memberIDs as string);
	}

	if (additionalFields.customRoleKeys) {
		body.customRoleKeys = parseUserKeys(additionalFields.customRoleKeys as string);
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		'/teams',
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getTeam(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/teams/${teamKey}`,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyTeams(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.filter) {
		query.filter = filters.filter;
	}

	if (filters.expand && (filters.expand as string[]).length > 0) {
		query.expand = (filters.expand as string[]).join(',');
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			'/teams',
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			'/teams',
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateTeam(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const operations: IDataObject[] = [];

	if (updateFields.name) {
		operations.push({
			op: 'replace',
			path: '/name',
			value: updateFields.name,
		});
	}

	if (updateFields.description !== undefined) {
		operations.push({
			op: 'replace',
			path: '/description',
			value: updateFields.description,
		});
	}

	if (updateFields.customRoleKeys) {
		operations.push({
			op: 'replace',
			path: '/customRoleKeys',
			value: parseUserKeys(updateFields.customRoleKeys as string),
		});
	}

	if (operations.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklyPatchRequest.call(
		this,
		`/teams/${teamKey}`,
		operations as any,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteTeam(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/teams/${teamKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: teamKey });
}

export async function addTeamMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;
	const memberIDs = this.getNodeParameter('memberIDs', index) as string;

	const members = parseUserKeys(memberIDs);
	const operations = members.map((memberId) => ({
		op: 'add',
		path: '/memberIDs/-',
		value: memberId,
	}));

	const response = await launchDarklyPatchRequest.call(
		this,
		`/teams/${teamKey}`,
		operations as any,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function removeTeamMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;
	const memberIDs = this.getNodeParameter('memberIDs', index) as string;

	// First get the team to find member indices
	const team = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/teams/${teamKey}`,
		{},
		{ expand: 'members' },
	) as IDataObject;

	const members = parseUserKeys(memberIDs);
	const teamMembers = ((team.members as IDataObject)?.items as IDataObject[]) || [];
	
	const operations: IDataObject[] = [];
	for (const memberId of members) {
		const memberIndex = teamMembers.findIndex((m) => m._id === memberId);
		if (memberIndex !== -1) {
			operations.push({
				op: 'remove',
				path: `/memberIDs/${memberIndex}`,
			});
		}
	}

	if (operations.length === 0) {
		return this.helpers.returnJsonArray({ success: true, message: 'No members to remove' });
	}

	// Sort operations by index in descending order to avoid index shifting issues
	operations.sort((a, b) => {
		const aIndex = parseInt((a.path as string).split('/').pop() || '0', 10);
		const bIndex = parseInt((b.path as string).split('/').pop() || '0', 10);
		return bIndex - aIndex;
	});

	const response = await launchDarklyPatchRequest.call(
		this,
		`/teams/${teamKey}`,
		operations as any,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getTeamMaintainers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const teamKey = this.getNodeParameter('teamKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/teams/${teamKey}/maintainers`,
	);

	const items = (response as IDataObject).items as IDataObject[] || [response];
	return this.helpers.returnJsonArray(items);
}
