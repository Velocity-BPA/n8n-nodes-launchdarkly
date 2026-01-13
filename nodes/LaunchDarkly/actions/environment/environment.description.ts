/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const environmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new environment',
				action: 'Create an environment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment',
				action: 'Delete an environment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an environment',
				action: 'Get an environment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many environments',
				action: 'Get many environments',
			},
			{
				name: 'Reset SDK Key',
				value: 'resetSDKKey',
				description: 'Reset the SDK key for an environment',
				action: 'Reset SDK key',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an environment',
				action: 'Update an environment',
			},
		],
		default: 'getMany',
	},
];

export const environmentFields: INodeProperties[] = [
	// ----------------------------------
	//         environment: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		description: 'The project key',
	},
	// ----------------------------------
	//         environment: create
	// ----------------------------------
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the environment. Must start with a lowercase letter and contain only lowercase letters, numbers, hyphens, and underscores.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the environment',
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		required: true,
		default: '#417505',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		description: 'The color for the environment (hex format)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['environment'],
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
				displayName: 'Default TTL',
				name: 'defaultTtl',
				type: 'number',
				default: 0,
				description: 'The default TTL (in minutes) for the environment',
			},
			{
				displayName: 'Secure Mode',
				name: 'secureMode',
				type: 'boolean',
				default: false,
				description: 'Whether to enable secure mode for the environment',
			},
			{
				displayName: 'Default Track Events',
				name: 'defaultTrackEvents',
				type: 'boolean',
				default: false,
				description: 'Whether to track events by default',
			},
			{
				displayName: 'Require Comments',
				name: 'requireComments',
				type: 'boolean',
				default: false,
				description: 'Whether to require comments for flag changes',
			},
			{
				displayName: 'Confirm Changes',
				name: 'confirmChanges',
				type: 'boolean',
				default: false,
				description: 'Whether to require confirmation for flag changes',
			},
		],
	},
	// ----------------------------------
	//         environment: get, update, delete, resetSDKKey
	// ----------------------------------
	{
		displayName: 'Environment Key',
		name: 'environmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['get', 'update', 'delete', 'resetSDKKey'],
			},
		},
		description: 'The environment key',
	},
	// ----------------------------------
	//         environment: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['environment'],
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
				resource: ['environment'],
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
	// ----------------------------------
	//         environment: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the environment',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'The new color for the environment (hex format)',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set',
			},
			{
				displayName: 'Default TTL',
				name: 'defaultTtl',
				type: 'number',
				default: 0,
				description: 'The default TTL (in minutes) for the environment',
			},
			{
				displayName: 'Secure Mode',
				name: 'secureMode',
				type: 'boolean',
				default: false,
				description: 'Whether to enable secure mode for the environment',
			},
			{
				displayName: 'Default Track Events',
				name: 'defaultTrackEvents',
				type: 'boolean',
				default: false,
				description: 'Whether to track events by default',
			},
			{
				displayName: 'Require Comments',
				name: 'requireComments',
				type: 'boolean',
				default: false,
				description: 'Whether to require comments for flag changes',
			},
			{
				displayName: 'Confirm Changes',
				name: 'confirmChanges',
				type: 'boolean',
				default: false,
				description: 'Whether to require confirmation for flag changes',
			},
		],
	},
	// ----------------------------------
	//         environment: resetSDKKey
	// ----------------------------------
	{
		displayName: 'Expiry',
		name: 'expiry',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['resetSDKKey'],
			},
		},
		description: 'How long (in milliseconds) before the old SDK key expires. Set to 0 for immediate expiration.',
	},
];
