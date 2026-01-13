/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const experimentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['experiment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new experiment',
				action: 'Create an experiment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an experiment',
				action: 'Get an experiment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many experiments',
				action: 'Get many experiments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an experiment',
				action: 'Update an experiment',
			},
		],
		default: 'getMany',
	},
];

export const experimentFields: INodeProperties[] = [
	// ----------------------------------
	//         experiment: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
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
				resource: ['experiment'],
			},
		},
		description: 'The environment key',
	},
	// ----------------------------------
	//         experiment: create
	// ----------------------------------
	{
		displayName: 'Experiment Key',
		name: 'experimentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the experiment',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the experiment',
	},
	{
		displayName: 'Hypothesis',
		name: 'hypothesis',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'The hypothesis for the experiment',
	},
	{
		displayName: 'Primary Metric Key',
		name: 'primaryMetricKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'The key of the primary metric for this experiment',
	},
	{
		displayName: 'Treatments',
		name: 'treatments',
		type: 'json',
		required: true,
		default: '[{"name": "Control", "baseline": true}, {"name": "Treatment"}]',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		description: 'The experiment treatments (at least 2 required)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the experiment',
			},
			{
				displayName: 'Maintainer ID',
				name: 'maintainerId',
				type: 'string',
				default: '',
				description: 'The ID of the member who maintains this experiment',
			},
			{
				displayName: 'Secondary Metrics',
				name: 'secondaryMetrics',
				type: 'string',
				default: '',
				description: 'Comma-separated list of secondary metric keys',
			},
			{
				displayName: 'Randomization Unit',
				name: 'randomizationUnit',
				type: 'string',
				default: 'user',
				description: 'The context kind to use for randomization (e.g., "user")',
			},
		],
	},
	// ----------------------------------
	//         experiment: get, update
	// ----------------------------------
	{
		displayName: 'Experiment Key',
		name: 'experimentKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['get', 'update'],
			},
		},
		description: 'The experiment key',
	},
	// ----------------------------------
	//         experiment: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['experiment'],
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
				resource: ['experiment'],
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
				resource: ['experiment'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Not Started',
						value: 'not_started',
					},
					{
						name: 'Running',
						value: 'running',
					},
					{
						name: 'Stopped',
						value: 'stopped',
					},
				],
				default: '',
				description: 'Filter by experiment status',
			},
		],
	},
	// ----------------------------------
	//         experiment: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['experiment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the experiment',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The new description for the experiment',
			},
			{
				displayName: 'Maintainer ID',
				name: 'maintainerId',
				type: 'string',
				default: '',
				description: 'The ID of the member who maintains this experiment',
			},
		],
	},
];
