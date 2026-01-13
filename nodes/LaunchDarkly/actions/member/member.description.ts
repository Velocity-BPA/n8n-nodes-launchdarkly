/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a member',
				action: 'Delete a member',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a member',
				action: 'Get a member',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many members',
				action: 'Get many members',
			},
			{
				name: 'Invite',
				value: 'invite',
				description: 'Invite new members',
				action: 'Invite new members',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a member',
				action: 'Update a member',
			},
		],
		default: 'getMany',
	},
];

export const memberFields: INodeProperties[] = [
	// ----------------------------------
	//         member: invite
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['invite'],
			},
		},
		description: 'Email address of the member to invite',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['invite'],
			},
		},
		options: [
			{
				displayName: 'Custom Roles',
				name: 'customRoles',
				type: 'string',
				default: '',
				description: 'Comma-separated list of custom role keys',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the member',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the member',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'No Access',
						value: 'no_access',
					},
					{
						name: 'Reader',
						value: 'reader',
					},
					{
						name: 'Writer',
						value: 'writer',
					},
				],
				default: 'reader',
				description: 'The built-in role for the member',
			},
		],
	},
	// ----------------------------------
	//         member: get, delete, update
	// ----------------------------------
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The member ID',
	},
	// ----------------------------------
	//         member: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['member'],
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
				resource: ['member'],
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
				resource: ['member'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Query',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter by email, first name, or last name',
			},
			{
				displayName: 'Team Key',
				name: 'team',
				type: 'string',
				default: '',
				description: 'Filter by team key',
			},
		],
	},
	// ----------------------------------
	//         member: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Custom Roles',
				name: 'customRoles',
				type: 'string',
				default: '',
				description: 'Comma-separated list of custom role keys',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'No Access',
						value: 'no_access',
					},
					{
						name: 'Reader',
						value: 'reader',
					},
					{
						name: 'Writer',
						value: 'writer',
					},
				],
				default: 'reader',
				description: 'The built-in role for the member',
			},
		],
	},
];
