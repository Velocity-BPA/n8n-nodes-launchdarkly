/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many projects',
				action: 'Get many projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
			},
		],
		default: 'getMany',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         project: create
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the project. Must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the project',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Include In Snippet By Default',
				name: 'includeInSnippetByDefault',
				type: 'boolean',
				default: false,
				description: 'Whether to include flags in the JavaScript snippet by default',
			},
			{
				displayName: 'Default Client Side Availability',
				name: 'defaultClientSideAvailability',
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
								description: 'Whether flags are available to mobile SDKs by default',
							},
							{
								displayName: 'Using Environment ID',
								name: 'usingEnvironmentId',
								type: 'boolean',
								default: false,
								description: 'Whether flags are available to client-side SDKs by default',
							},
						],
					},
				],
			},
			{
				displayName: 'Environments',
				name: 'environments',
				type: 'json',
				default: '[]',
				description: 'Initial environments to create with the project',
			},
		],
	},
	// ----------------------------------
	//         project: get, update, delete
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The project key',
	},
	// ----------------------------------
	//         project: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
				resource: ['project'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Filter by project name or key',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Filter by tag',
			},
		],
	},
	// ----------------------------------
	//         project: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the project',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set',
			},
			{
				displayName: 'Include In Snippet By Default',
				name: 'includeInSnippetByDefault',
				type: 'boolean',
				default: false,
				description: 'Whether to include flags in the JavaScript snippet by default',
			},
		],
	},
];
