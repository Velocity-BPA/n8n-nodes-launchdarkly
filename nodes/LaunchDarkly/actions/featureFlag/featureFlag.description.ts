/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const featureFlagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['featureFlag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new feature flag',
				action: 'Create a feature flag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a feature flag',
				action: 'Delete a feature flag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a feature flag',
				action: 'Get a feature flag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many feature flags',
				action: 'Get many feature flags',
			},
			{
				name: 'Toggle',
				value: 'toggle',
				description: 'Toggle a feature flag on or off',
				action: 'Toggle a feature flag',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a feature flag',
				action: 'Update a feature flag',
			},
			{
				name: 'Copy',
				value: 'copy',
				description: 'Copy a feature flag to another environment',
				action: 'Copy a feature flag',
			},
		],
		default: 'getMany',
	},
];

export const featureFlagFields: INodeProperties[] = [
	// ----------------------------------
	//         featureFlag: create
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['create', 'get', 'getMany', 'update', 'delete', 'toggle', 'copy'],
			},
		},
		description: 'The project key',
	},
	{
		displayName: 'Flag Key',
		name: 'flagKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the feature flag. Must start with a letter and contain only letters, numbers, periods, underscores, and hyphens.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the feature flag',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the feature flag',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Variations',
				name: 'variations',
				type: 'json',
				default: '[{"value": true}, {"value": false}]',
				description: 'An array of possible variations for the flag',
			},
			{
				displayName: 'Temporary',
				name: 'temporary',
				type: 'boolean',
				default: false,
				description: 'Whether the flag is temporary',
			},
			{
				displayName: 'Include In Snippet',
				name: 'includeInSnippet',
				type: 'boolean',
				default: false,
				description: 'Whether this flag should be available to client-side SDKs',
			},
			{
				displayName: 'Client Side Availability',
				name: 'clientSideAvailability',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Availability',
						name: 'availability',
						values: [
							{
								displayName: 'Using Mobile Key',
								name: 'usingMobileKey',
								type: 'boolean',
								default: false,
								description: 'Whether the flag is available using the mobile key',
							},
							{
								displayName: 'Using Environment ID',
								name: 'usingEnvironmentId',
								type: 'boolean',
								default: false,
								description: 'Whether the flag is available using the environment ID',
							},
						],
					},
				],
			},
		],
	},
	// ----------------------------------
	//         featureFlag: get
	// ----------------------------------
	{
		displayName: 'Feature Flag Key',
		name: 'featureFlagKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['get', 'update', 'delete', 'toggle', 'copy'],
			},
		},
		description: 'The feature flag key',
	},
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: false,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['get'],
			},
		},
		description: 'Filter to a specific environment',
	},
	// ----------------------------------
	//         featureFlag: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 20,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Environment Key Filter',
				name: 'env',
				type: 'string',
				default: '',
				description: 'Filter to a specific environment',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Filter by tag',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Filter by flag key or name',
			},
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to filter for archived flags',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'boolean',
				default: false,
				description: 'Whether to return a summary view (less data)',
			},
		],
	},
	// ----------------------------------
	//         featureFlag: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the feature flag',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The new description for the feature flag',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set',
			},
			{
				displayName: 'Temporary',
				name: 'temporary',
				type: 'boolean',
				default: false,
				description: 'Whether the flag is temporary',
			},
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to archive the flag',
			},
		],
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['update', 'toggle'],
			},
		},
		description: 'Optional comment to describe the change',
	},
	// ----------------------------------
	//         featureFlag: toggle
	// ----------------------------------
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['toggle'],
			},
		},
		description: 'The environment key',
	},
	{
		displayName: 'Enable Flag',
		name: 'enabled',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['toggle'],
			},
		},
		description: 'Whether to enable (true) or disable (false) the flag',
	},
	// ----------------------------------
	//         featureFlag: copy
	// ----------------------------------
	{
		displayName: 'Source Environment',
		name: 'sourceEnvironmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['copy'],
			},
		},
		description: 'The source environment key',
	},
	{
		displayName: 'Target Environment',
		name: 'targetEnvironmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['copy'],
			},
		},
		description: 'The target environment key',
	},
	{
		displayName: 'Copy Options',
		name: 'copyOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['featureFlag'],
				operation: ['copy'],
			},
		},
		options: [
			{
				displayName: 'Include Targeting',
				name: 'includedActions',
				type: 'multiOptions',
				options: [
					{
						name: 'Update On',
						value: 'updateOn',
					},
					{
						name: 'Update Prerequisites',
						value: 'updatePrerequisites',
					},
					{
						name: 'Update Targets',
						value: 'updateTargets',
					},
					{
						name: 'Update Rules',
						value: 'updateRules',
					},
					{
						name: 'Update Fallthrough',
						value: 'updateFallthrough',
					},
					{
						name: 'Update Off Variation',
						value: 'updateOffVariation',
					},
				],
				default: [],
				description: 'Which settings to copy',
			},
		],
	},
];
