/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { LaunchDarkly } from '../../nodes/LaunchDarkly/LaunchDarkly.node';

describe('LaunchDarkly Node', () => {
	let node: LaunchDarkly;

	beforeEach(() => {
		node = new LaunchDarkly();
	});

	describe('Node Definition', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('LaunchDarkly');
		});

		it('should have correct node name', () => {
			expect(node.description.name).toBe('launchDarkly');
		});

		it('should have correct credentials', () => {
			expect(node.description.credentials).toHaveLength(1);
			expect(node.description.credentials?.[0].name).toBe('launchDarklyApi');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have main inputs and outputs', () => {
			expect(node.description.inputs).toContain('main');
			expect(node.description.outputs).toContain('main');
		});
	});

	describe('Resources', () => {
		it('should have all 12 resources', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
			
			const options = resourceProperty?.options as Array<{ value: string }>;
			const resourceValues = options.map((o) => o.value);
			
			expect(resourceValues).toContain('featureFlag');
			expect(resourceValues).toContain('targeting');
			expect(resourceValues).toContain('segment');
			expect(resourceValues).toContain('environment');
			expect(resourceValues).toContain('project');
			expect(resourceValues).toContain('user');
			expect(resourceValues).toContain('auditLog');
			expect(resourceValues).toContain('metric');
			expect(resourceValues).toContain('experiment');
			expect(resourceValues).toContain('webhook');
			expect(resourceValues).toContain('team');
			expect(resourceValues).toContain('member');
			expect(resourceValues).toHaveLength(12);
		});
	});

	describe('Feature Flag Operations', () => {
		it('should have all feature flag operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('featureFlag')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
			expect(opValues).toContain('toggle');
			expect(opValues).toContain('copy');
		});
	});

	describe('Targeting Operations', () => {
		it('should have all targeting operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('targeting')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('getFlagState');
			expect(opValues).toContain('addUserTarget');
			expect(opValues).toContain('removeUserTarget');
			expect(opValues).toContain('updateFallthrough');
			expect(opValues).toContain('updateOffVariation');
			expect(opValues).toContain('updateTargeting');
		});
	});

	describe('Segment Operations', () => {
		it('should have all segment operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('segment')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
			expect(opValues).toContain('addUsers');
			expect(opValues).toContain('removeUsers');
		});
	});

	describe('Environment Operations', () => {
		it('should have all environment operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('environment')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
			expect(opValues).toContain('resetSDKKey');
		});
	});

	describe('Project Operations', () => {
		it('should have all project operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('project')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
		});
	});

	describe('User Operations', () => {
		it('should have all user operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('user')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('get');
			expect(opValues).toContain('search');
			expect(opValues).toContain('delete');
		});
	});

	describe('Audit Log Operations', () => {
		it('should have all audit log operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('auditLog')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
		});
	});

	describe('Metric Operations', () => {
		it('should have all metric operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('metric')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
		});
	});

	describe('Experiment Operations', () => {
		it('should have all experiment operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('experiment')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
		});
	});

	describe('Webhook Operations', () => {
		it('should have all webhook operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('webhook')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
		});
	});

	describe('Team Operations', () => {
		it('should have all team operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('team')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('create');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
			expect(opValues).toContain('addMembers');
			expect(opValues).toContain('removeMembers');
			expect(opValues).toContain('getMaintainers');
		});
	});

	describe('Member Operations', () => {
		it('should have all member operations', () => {
			const operations = node.description.properties.filter(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('member')
			);
			
			expect(operations).toHaveLength(1);
			const opOptions = operations[0].options as Array<{ value: string }>;
			const opValues = opOptions.map((o) => o.value);
			
			expect(opValues).toContain('invite');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getMany');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
		});
	});
});
