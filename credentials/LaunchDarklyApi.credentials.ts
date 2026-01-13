/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LaunchDarklyApi implements ICredentialType {
	name = 'launchDarklyApi';
	displayName = 'LaunchDarkly API';
	documentationUrl = 'https://docs.launchdarkly.com/home/connecting/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'LaunchDarkly API Access Token. Create one in Account Settings > Authorization > Access Tokens.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.launchdarkly.com/api/v2',
			url: '/projects',
			method: 'GET',
		},
	};
}
