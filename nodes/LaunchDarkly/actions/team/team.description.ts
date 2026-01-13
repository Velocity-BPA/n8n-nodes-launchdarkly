/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Add Members',
				value: 'addMembers',
				description: 'Add members to a team',
				action: 'Add members to a team',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new team',
				action: 'Create a team',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a team',
				action: 'Delete a team',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a team',
				action: 'Get a team',
			},
			{
				name: 'Get Maintainers',
				value: 'getMaintainers',
				description: 'Get team maintainers',
				action: 'Get team maintainers',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many teams',
				action: 'Get many teams',
			},
			{
				name: 'Remove Members',
				value: 'removeMembers',
				description: 'Remove members from a team',
				action: 'Remove members from a team',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a team',
				action: 'Update a team',
			},
		],
		default: 'getMany',
	},
];

export const teamFields: INodeProperties[] = [
	// ----------------------------------
	//         team: create
	// ----------------------------------
	{
		displayName: 'Team Key',
		name: 'teamKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the team (slug)',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the team',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Custom Role Keys',
				name: 'customRoleKeys',
				type: 'string',
				default: '',
				description: 'Comma-separated list of custom role keys to assign to the team',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the team',
			},
			{
				displayName: 'Member IDs',
				name: 'memberIDs',
				type: 'string',
				default: '',
				description: 'Comma-separated list of member IDs to add to the team',
			},
		],
	},
	// ----------------------------------
	//         team: get, delete, update, getMaintainers
	// ----------------------------------
	{
		displayName: 'Team Key',
		name: 'teamKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['get', 'delete', 'update', 'getMaintainers', 'addMembers', 'removeMembers'],
			},
		},
		description: 'The team key',
	},
	// ----------------------------------
	//         team: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['team'],
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
				resource: ['team'],
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
				resource: ['team'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'multiOptions',
				options: [
					{
						name: 'Members',
						value: 'members',
					},
					{
						name: 'Maintainers',
						value: 'maintainers',
					},
					{
						name: 'Roles',
						value: 'roles',
					},
				],
				default: [],
				description: 'Include additional information in the response',
			},
			{
				displayName: 'Query',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter teams by name or key',
			},
		],
	},
	// ----------------------------------
	//         team: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Custom Role Keys',
				name: 'customRoleKeys',
				type: 'string',
				default: '',
				description: 'Comma-separated list of custom role keys',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the team',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The team name',
			},
		],
	},
	// ----------------------------------
	//         team: addMembers, removeMembers
	// ----------------------------------
	{
		displayName: 'Member IDs',
		name: 'memberIDs',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['addMembers', 'removeMembers'],
			},
		},
		description: 'Comma-separated list of member IDs',
	},
];
