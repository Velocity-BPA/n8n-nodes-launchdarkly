/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';
import { createHmac } from 'crypto';

export class LaunchDarklyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LaunchDarkly Trigger',
		name: 'launchDarklyTrigger',
		icon: 'file:launchdarkly.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive events from LaunchDarkly webhooks',
		defaults: {
			name: 'LaunchDarkly Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'launchDarklyApi',
				required: false,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Approval Approved',
						value: 'approval.approved',
						description: 'Approval was approved',
					},
					{
						name: 'Approval Requested',
						value: 'approval.requested',
						description: 'Approval was requested',
					},
					{
						name: 'Environment Created',
						value: 'environment.created',
						description: 'Environment was created',
					},
					{
						name: 'Experiment Started',
						value: 'experiment.started',
						description: 'Experiment was started',
					},
					{
						name: 'Experiment Stopped',
						value: 'experiment.stopped',
						description: 'Experiment was stopped',
					},
					{
						name: 'Flag Created',
						value: 'flag.created',
						description: 'Feature flag was created',
					},
					{
						name: 'Flag Deleted',
						value: 'flag.deleted',
						description: 'Feature flag was deleted',
					},
					{
						name: 'Flag Off',
						value: 'flag.off',
						description: 'Feature flag was turned off',
					},
					{
						name: 'Flag On',
						value: 'flag.on',
						description: 'Feature flag was turned on',
					},
					{
						name: 'Flag Updated',
						value: 'flag.updated',
						description: 'Feature flag was updated',
					},
					{
						name: 'Member Invited',
						value: 'member.invited',
						description: 'Member was invited',
					},
					{
						name: 'Member Joined',
						value: 'member.joined',
						description: 'Member joined the account',
					},
					{
						name: 'Project Created',
						value: 'project.created',
						description: 'Project was created',
					},
					{
						name: 'Project Updated',
						value: 'project.updated',
						description: 'Project was updated',
					},
					{
						name: 'Segment Created',
						value: 'segment.created',
						description: 'Segment was created',
					},
					{
						name: 'Segment Updated',
						value: 'segment.updated',
						description: 'Segment was updated',
					},
				],
				default: ['flag.created', 'flag.updated'],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Optional secret to verify webhook signatures (must match the secret configured in LaunchDarkly)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: false,
						description: 'Whether to verify the webhook signature using the secret',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// LaunchDarkly webhooks need to be configured manually in the LaunchDarkly dashboard
				// pointing to the webhook URL provided by n8n
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Webhook creation is done manually in LaunchDarkly
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhook deletion is done manually in LaunchDarkly
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		
		const events = this.getNodeParameter('events') as string[];
		const webhookSecret = this.getNodeParameter('webhookSecret', '') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Verify signature if enabled and secret is provided
		if (options.verifySignature && webhookSecret) {
			const signature = headers['x-ld-signature'] as string;
			
			if (!signature) {
				return {
					webhookResponse: { status: 401, body: 'Missing signature header' },
				};
			}

			// Get raw body for signature verification
			const rawBody = JSON.stringify(body);
			const expectedSignature = createHmac('sha256', webhookSecret)
				.update(rawBody)
				.digest('hex');

			if (signature !== expectedSignature) {
				return {
					webhookResponse: { status: 401, body: 'Invalid signature' },
				};
			}
		}

		// Check if the event type matches
		const eventKind = body.kind as string || body._type as string || '';
		
		// Filter by event type if specified
		if (events.length > 0 && !events.includes('*')) {
			const matchesEvent = events.some((event) => {
				// Check if the event kind matches any of the subscribed events
				return eventKind.toLowerCase().includes(event.replace('.', '').toLowerCase()) ||
					event.toLowerCase().includes(eventKind.toLowerCase());
			});

			if (!matchesEvent) {
				// Event doesn't match, but we still acknowledge the webhook
				return {
					webhookResponse: { status: 200, body: 'Event not subscribed' },
				};
			}
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					...body,
					webhookEvent: eventKind,
					receivedAt: new Date().toISOString(),
				}),
			],
		};
	}
}
