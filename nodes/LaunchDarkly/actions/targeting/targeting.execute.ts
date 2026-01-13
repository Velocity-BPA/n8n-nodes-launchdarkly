/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import {
	launchDarklyApiRequest,
	launchDarklySemanticPatchRequest,
	parseJsonParameter,
} from '../../transport/launchDarklyApi';

export async function getFlagState(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;

	const response = await launchDarklyApiRequest.call(
		this,
		'GET',
		`/flags/${projectKey}/${featureFlagKey}`,
		{},
		{ env: environmentKey },
	);

	// Extract the environment-specific state
	const flagData = response as IDataObject;
	const environments = flagData.environments as IDataObject;
	const envState = environments ? environments[environmentKey] : null;

	return this.helpers.returnJsonArray({
		key: flagData.key,
		name: flagData.name,
		environmentKey,
		state: envState,
	});
}

export async function addUserTarget(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const userKey = this.getNodeParameter('userKey', index) as string;
	const variationIndex = this.getNodeParameter('variationIndex', index) as number;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const instructions = [
		{
			kind: 'addUserTargets',
			environmentKey,
			variationId: variationIndex,
			values: [userKey],
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

export async function removeUserTarget(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const userKey = this.getNodeParameter('userKey', index) as string;
	const variationIndex = this.getNodeParameter('variationIndex', index) as number;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const instructions = [
		{
			kind: 'removeUserTargets',
			environmentKey,
			variationId: variationIndex,
			values: [userKey],
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

export async function updateFallthrough(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const fallthroughType = this.getNodeParameter('fallthroughType', index) as string;
	const comment = this.getNodeParameter('comment', index, '') as string;

	let instruction: IDataObject;

	if (fallthroughType === 'variation') {
		const variationIndex = this.getNodeParameter('variationIndex', index) as number;
		instruction = {
			kind: 'updateFallthroughVariationOrRollout',
			environmentKey,
			variationId: variationIndex,
		};
	} else {
		const rolloutWeightsRaw = this.getNodeParameter('rolloutWeights', index) as string;
		const rolloutWeights = parseJsonParameter(rolloutWeightsRaw);
		instruction = {
			kind: 'updateFallthroughVariationOrRollout',
			environmentKey,
			rolloutWeights,
		};
	}

	const response = await launchDarklySemanticPatchRequest.call(
		this,
		`/flags/${projectKey}/${featureFlagKey}`,
		[instruction],
		comment || undefined,
	);

	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateOffVariation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const offVariationIndex = this.getNodeParameter('offVariationIndex', index) as number;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const instructions = [
		{
			kind: 'updateOffVariation',
			environmentKey,
			variationId: offVariationIndex,
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

export async function updateTargeting(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const projectKey = this.getNodeParameter('projectKey', index) as string;
	const featureFlagKey = this.getNodeParameter('featureFlagKey', index) as string;
	const environmentKey = this.getNodeParameter('environmentKey', index) as string;
	const rulesRaw = this.getNodeParameter('rules', index) as string;
	const comment = this.getNodeParameter('comment', index, '') as string;

	const rules = parseJsonParameter(rulesRaw) as IDataObject[];

	const instructions = [
		{
			kind: 'replaceRules',
			environmentKey,
			rules,
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
