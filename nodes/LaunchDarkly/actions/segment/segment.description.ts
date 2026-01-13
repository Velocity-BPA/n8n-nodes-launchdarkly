/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['segment'],
			},
		},
		options: [
			{
				name: 'Add Users',
				value: 'addUsers',
				description: 'Add users to a segment',
				action: 'Add users to segment',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new segment',
				action: 'Create a segment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a segment',
				action: 'Delete a segment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a segment',
				action: 'Get a segment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many segments',
				action: 'Get many segments',
			},
			{
				name: 'Remove Users',
				value: 'removeUsers',
				description: 'Remove users from a segment',
				action: 'Remove users from segment',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a segment',
				action: 'Update a segment',
			},
		],
		default: 'getMany',
	},
];

export const segmentFields: INodeProperties[] = [
	// ----------------------------------
	//         segment: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
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
				resource: ['segment'],
			},
		},
		description: 'The environment key',
	},
	// ----------------------------------
	//         segment: create
	// ----------------------------------
	{
		displayName: 'Segment Key',
		name: 'segmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the segment',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the segment',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the segment',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Included Users',
				name: 'included',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user keys to include',
			},
			{
				displayName: 'Excluded Users',
				name: 'excluded',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user keys to exclude',
			},
		],
	},
	// ----------------------------------
	//         segment: get, update, delete, addUsers, removeUsers
	// ----------------------------------
	{
		displayName: 'Segment Key',
		name: 'segmentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['get', 'update', 'delete', 'addUsers', 'removeUsers'],
			},
		},
		description: 'The segment key',
	},
	// ----------------------------------
	//         segment: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['segment'],
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
				resource: ['segment'],
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
				resource: ['segment'],
				operation: ['getMany'],
			},
		},
		options: [
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
	//         segment: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the segment',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The new description for the segment',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set',
			},
		],
	},
	// ----------------------------------
	//         segment: addUsers / removeUsers
	// ----------------------------------
	{
		displayName: 'User Keys',
		name: 'userKeys',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['addUsers', 'removeUsers'],
			},
		},
		description: 'Comma-separated list of user keys',
	},
	{
		displayName: 'Target Type',
		name: 'targetType',
		type: 'options',
		required: true,
		default: 'included',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['addUsers', 'removeUsers'],
			},
		},
		options: [
			{
				name: 'Included',
				value: 'included',
				description: 'Add to / remove from included users',
			},
			{
				name: 'Excluded',
				value: 'excluded',
				description: 'Add to / remove from excluded users',
			},
		],
		description: 'Whether to add/remove users to/from included or excluded list',
	},
	// ----------------------------------
	//         segment: comment
	// ----------------------------------
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['segment'],
				operation: ['update', 'addUsers', 'removeUsers'],
			},
		},
		description: 'Optional comment to describe the change',
	},
];
