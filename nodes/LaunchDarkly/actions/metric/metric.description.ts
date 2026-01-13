/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const metricOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['metric'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new metric',
				action: 'Create a metric',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a metric',
				action: 'Delete a metric',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a metric',
				action: 'Get a metric',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many metrics',
				action: 'Get many metrics',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a metric',
				action: 'Update a metric',
			},
		],
		default: 'getMany',
	},
];

export const metricFields: INodeProperties[] = [
	// ----------------------------------
	//         metric: all operations
	// ----------------------------------
	{
		displayName: 'Project Key',
		name: 'projectKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
			},
		},
		description: 'The project key',
	},
	// ----------------------------------
	//         metric: create
	// ----------------------------------
	{
		displayName: 'Metric Key',
		name: 'metricKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
			},
		},
		description: 'A unique key for the metric',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
			},
		},
		description: 'A human-readable name for the metric',
	},
	{
		displayName: 'Kind',
		name: 'kind',
		type: 'options',
		required: true,
		default: 'custom',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Click',
				value: 'click',
				description: 'Track click events on an element',
			},
			{
				name: 'Custom',
				value: 'custom',
				description: 'Track custom events',
			},
			{
				name: 'Page View',
				value: 'pageview',
				description: 'Track page views',
			},
		],
		description: 'The type of metric',
	},
	{
		displayName: 'Event Key',
		name: 'eventKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
				kind: ['custom'],
			},
		},
		description: 'The event key for custom metrics',
	},
	{
		displayName: 'Selector',
		name: 'selector',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
				kind: ['click'],
			},
		},
		description: 'CSS selector for click metrics',
	},
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
				kind: ['click', 'pageview'],
			},
		},
		description: 'URLs to track for click or pageview metrics. Format: [{"kind": "exact", "url": "https://example.com"}]',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the metric',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Is Numeric',
				name: 'isNumeric',
				type: 'boolean',
				default: false,
				description: 'Whether the metric is numeric',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: '',
				description: 'The unit of measurement for numeric metrics',
			},
			{
				displayName: 'Success Criteria',
				name: 'successCriteria',
				type: 'options',
				options: [
					{
						name: 'Higher Is Better',
						value: 'HigherIsBetter',
					},
					{
						name: 'Lower Is Better',
						value: 'LowerIsBetter',
					},
				],
				default: 'HigherIsBetter',
				description: 'How to interpret metric values',
			},
		],
	},
	// ----------------------------------
	//         metric: get, update, delete
	// ----------------------------------
	{
		displayName: 'Metric Key',
		name: 'metricKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The metric key',
	},
	// ----------------------------------
	//         metric: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['metric'],
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
				resource: ['metric'],
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
	//         metric: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['metric'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the metric',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The new description for the metric',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set',
			},
			{
				displayName: 'Is Numeric',
				name: 'isNumeric',
				type: 'boolean',
				default: false,
				description: 'Whether the metric is numeric',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: '',
				description: 'The unit of measurement for numeric metrics',
			},
			{
				displayName: 'Success Criteria',
				name: 'successCriteria',
				type: 'options',
				options: [
					{
						name: 'Higher Is Better',
						value: 'HigherIsBetter',
					},
					{
						name: 'Lower Is Better',
						value: 'LowerIsBetter',
					},
				],
				default: 'HigherIsBetter',
				description: 'How to interpret metric values',
			},
		],
	},
];
