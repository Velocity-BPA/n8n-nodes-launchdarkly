/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const auditLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auditLog'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an audit log entry',
				action: 'Get an audit log entry',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many audit log entries',
				action: 'Get many audit log entries',
			},
		],
		default: 'getMany',
	},
];

export const auditLogFields: INodeProperties[] = [
	// ----------------------------------
	//         auditLog: get
	// ----------------------------------
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['auditLog'],
				operation: ['get'],
			},
		},
		description: 'The audit log entry ID',
	},
	// ----------------------------------
	//         auditLog: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['auditLog'],
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
				resource: ['auditLog'],
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
				resource: ['auditLog'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Before',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'Get entries before this timestamp (Unix milliseconds or ISO string)',
			},
			{
				displayName: 'After',
				name: 'after',
				type: 'dateTime',
				default: '',
				description: 'Get entries after this timestamp (Unix milliseconds or ISO string)',
			},
			{
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Text to search for in the audit log',
			},
			{
				displayName: 'Spec',
				name: 'spec',
				type: 'string',
				default: '',
				description: 'A resource specifier, such as "proj/*:env/*:flag/my-flag"',
			},
		],
	},
];
