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
	launchDarklySemanticPatchRequest,
} from '../../transport/launchDarklyApi';
import { parseTags, parseVariations } from '../../utils/helpers';

export async function createFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const flagKey = this.getNodeParameter('flagKey', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		key: flagKey,
		name,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}

	if (additionalFields.tags) {
		body.tags = parseTags(additionalFields.tags as string);
	}

	if (additionalFields.variations) {
		body.variations = parseVariations(additionalFields.variations as string);
	}

	if (additionalFields.temporary !== undefined) {
		body.temporary = additionalFields.temporary;
	}

	if (additionalFields.includeInSnippet !== undefined) {
		body.includeInSnippet = additionalFields.includeInSnippet;
	}

	if (additionalFields.clientSideAvailability) {
		const csa = (additionalFields.clientSideAvailability as IDataObject).availability as IDataObject;
		if (csa) {
			body.clientSideAvailability = csa;
		}
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/flags/${projectKey}`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index, '') as string;

	const query: IDataObject = {};
	if (environmentKey) {
		query.env = environmentKey;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/flags/${projectKey}/${featureFlagKey}`,
		{},
		query,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getManyFeatureFlags(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const query: IDataObject = {};

	if (filters.env) {
		query.env = filters.env;
	}
	if (filters.tag) {
		query.tag = filters.tag;
	}
	if (filters.query) {
		query.query = filters.query;
	}
	if (filters.archived !== undefined) {
		query.archived = filters.archived;
	}
	if (filters.summary !== undefined) {
		query.summary = filters.summary;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await launchDarklyApiRequestAllItems.call(
			this,
			'GET',
			`/flags/${projectKey}`,
			{},
			query,
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.limit = limit;
		const result = await launchDarklyApiRequest.call(
			this,
			'GET',
			`/flags/${projectKey}`,
			{},
			query,
		);
		response = (result as IDataObject).items as IDataObject[] || [];
	}

	return this.helpers.returnJsonArray(response);
}

export async function updateFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const instructions: IDataObject[] = [];

	if (updateFields.name) {
		instructions.push({
			kind: 'updateName',
			value: updateFields.name,
		});
	}

	if (updateFields.description !== undefined) {
		instructions.push({
			kind: 'updateDescription',
			value: updateFields.description,
		});
	}

	if (updateFields.tags) {
		const tags = parseTags(updateFields.tags as string);
		instructions.push({
			kind: 'replaceTags',
			value: tags,
		});
	}

	if (updateFields.temporary !== undefined) {
		instructions.push({
			kind: 'updateTemporary',
			value: updateFields.temporary,
		});
	}

	if (updateFields.archived !== undefined) {
		if (updateFields.archived) {
			instructions.push({ kind: 'archiveFlag' });
		} else {
			instructions.push({ kind: 'restoreFlag' });
		}
	}

	if (instructions.length === 0) {
		throw new Error('At least one update field must be specified');
	}

	const response = await launchDarklySemanticPatchRequest.call(
		this,
		`/flags/${projectKey}/${featureFlagKey}`,
		instructions,
		comment || undefined,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;

	await launchDarklyApiRequest.call(
		this,
		'DELETE',
		`/flags/${projectKey}/${featureFlagKey}`,
	);

	return this.helpers.returnJsonArray({ success: true, deleted: featureFlagKey });
}

export async function toggleFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const enabled = this.getNodeParameter('enabled', index) as boolean;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const instructions = [
		{
			kind: enabled ? 'turnFlagOn' : 'turnFlagOff',
			environmentKey,
		},
	];

	const response = await launchDarklySemanticPatchRequest.call(
		this,
		`/flags/${projectKey}/${featureFlagKey}`,
		instructions,
		comment || undefined,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function copyFeatureFlag(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const sourceEnvironmentKey = this.getNodeParameter('sourceEnvironmentKey', index) as string;
	const targetEnvironmentKey = this.getNodeParameter('targetEnvironmentKey', index) as string;
	const copyOptions = this.getNodeParameter('copyOptions', index) as IDataObject;

	const body: IDataObject = {
		source: {
			key: sourceEnvironmentKey,
		},
		target: {
			key: targetEnvironmentKey,
		},
	};

	if (copyOptions.includedActions) {
		body.includedActions = copyOptions.includedActions;
	}

	const response = await launchDarklyApiRequest.call(
		this,
		'POST',
		`/flags/${projectKey}/${featureFlagKey}/copy`,
		body,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}
