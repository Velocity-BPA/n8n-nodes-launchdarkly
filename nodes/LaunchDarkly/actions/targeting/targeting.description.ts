/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const targetingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['targeting'],
			},
		},
		options: [
			{
				name: 'Add User Target',
				value: 'addUserTarget',
				description: 'Add a user to a targeting variation',
				action: 'Add user target',
			},
			{
				name: 'Get Flag State',
				value: 'getFlagState',
				description: 'Get the flag state for an environment',
				action: 'Get flag state',
			},
			{
				name: 'Remove User Target',
				value: 'removeUserTarget',
				description: 'Remove a user from a targeting variation',
				action: 'Remove user target',
			},
			{
				name: 'Update Fallthrough',
				value: 'updateFallthrough',
				description: 'Update the fallthrough (default) rule',
				action: 'Update fallthrough',
			},
			{
				name: 'Update Off Variation',
				value: 'updateOffVariation',
				description: 'Update the off variation',
				action: 'Update off variation',
			},
			{
				name: 'Update Targeting',
				value: 'updateTargeting',
				description: 'Update targeting rules',
				action: 'Update targeting rules',
			},
		],
		default: 'getFlagState',
	},
];

export const targetingFields: INodeProperties[] = [
	// ----------------------------------
	//         targeting: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['targeting'],
			},
		},
		description: 'The project key',
	},
	{
		displayName: 'Feature Flag Key',
		name: 'featureFlagKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['targeting'],
			},
		},
		description: 'The feature flag key',
	},
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['targeting'],
			},
		},
		description: 'The environment key',
	},
	// ----------------------------------
	//         targeting: addUserTarget / removeUserTarget
	// ----------------------------------
	{
		displayName: 'User Key',
		name: 'userKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['addUserTarget', 'removeUserTarget'],
			},
		},
		description: 'The user key to target',
	},
	{
		displayName: 'Variation Index',
		name: 'variationIndex',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['addUserTarget', 'removeUserTarget'],
			},
		},
		description: 'The index of the variation to target (0-based)',
	},
	// ----------------------------------
	//         targeting: updateFallthrough
	// ----------------------------------
	{
		displayName: 'Fallthrough Type',
		name: 'fallthroughType',
		type: 'options',
		required: true,
		default: 'variation',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['updateFallthrough'],
			},
		},
		options: [
			{
				name: 'Variation',
				value: 'variation',
				description: 'Serve a specific variation',
			},
			{
				name: 'Rollout',
				value: 'rollout',
				description: 'Percentage rollout',
			},
		],
		description: 'The type of fallthrough rule',
	},
	{
		displayName: 'Variation Index',
		name: 'variationIndex',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['updateFallthrough'],
				fallthroughType: ['variation'],
			},
		},
		description: 'The index of the variation to serve (0-based)',
	},
	{
		displayName: 'Rollout Weights',
		name: 'rolloutWeights',
		type: 'json',
		required: true,
		default: '[{"variation": 0, "weight": 50000}, {"variation": 1, "weight": 50000}]',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['updateFallthrough'],
				fallthroughType: ['rollout'],
			},
		},
		description: 'Rollout weights (weight is in thousandths, e.g., 50000 = 50%)',
	},
	// ----------------------------------
	//         targeting: updateOffVariation
	// ----------------------------------
	{
		displayName: 'Off Variation Index',
		name: 'offVariationIndex',
		type: 'number',
		required: true,
		default: 1,
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['updateOffVariation'],
			},
		},
		description: 'The index of the variation to serve when the flag is off (0-based)',
	},
	// ----------------------------------
	//         targeting: updateTargeting
	// ----------------------------------
	{
		displayName: 'Rules',
		name: 'rules',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['updateTargeting'],
			},
		},
		description: 'The targeting rules as JSON array',
	},
	// ----------------------------------
	//         targeting: all - comment
	// ----------------------------------
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['targeting'],
				operation: ['addUserTarget', 'removeUserTarget', 'updateFallthrough', 'updateOffVariation', 'updateTargeting'],
			},
		},
		description: 'Optional comment to describe the change',
	},
];
