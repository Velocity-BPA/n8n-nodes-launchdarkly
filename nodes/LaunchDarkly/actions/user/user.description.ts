/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user',
				action: 'Delete a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user',
				action: 'Get a user',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for users',
				action: 'Search users',
			},
		],
		default: 'search',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		description: 'The project key',
	},
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		description: 'The environment key',
	},
	// ----------------------------------
	//         user: get, delete
	// ----------------------------------
	{
		displayName: 'User Key',
		name: 'userKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The user key',
	},
	// ----------------------------------
	//         user: search
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search'],
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
				resource: ['user'],
				operation: ['search'],
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
				resource: ['user'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search query to filter users by key, name, email, or other attributes',
			},
			{
				displayName: 'Search After',
				name: 'searchAfter',
				type: 'string',
				default: '',
				description: 'Cursor for pagination. Use the searchAfter value from a previous response.',
			},
		],
	},
];
