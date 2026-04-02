/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { LaunchDarkly } from '../nodes/LaunchDarkly/LaunchDarkly.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('LaunchDarkly Node', () => {
  let node: LaunchDarkly;

  beforeAll(() => {
    node = new LaunchDarkly();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('LaunchDarkly');
      expect(node.description.name).toBe('launchdarkly');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Feature Flags Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://app.launchdarkly.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllFlags', () => {
		it('should get all flags successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllFlags') // operation
				.mockReturnValueOnce('test-project') // projectKey
				.mockReturnValueOnce('production') // env
				.mockReturnValueOnce(false); // summary

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				items: [{ key: 'flag1', name: 'Test Flag 1' }],
			});

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://app.launchdarkly.com/api/v2/flags/test-project?env=production',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toHaveLength(1);
		});

		it('should handle getAllFlags error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllFlags')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getFlag', () => {
		it('should get a single flag successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFlag')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-flag')
				.mockReturnValueOnce('production');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				key: 'test-flag',
				name: 'Test Flag',
			});

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://app.launchdarkly.com/api/v2/flags/test-project/test-flag?env=production',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toHaveLength(1);
		});
	});

	describe('createFlag', () => {
		it('should create a flag successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createFlag')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('Test Flag')
				.mockReturnValueOnce('test-flag')
				.mockReturnValueOnce('[{"value": true}, {"value": false}]');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				key: 'test-flag',
				name: 'Test Flag',
			});

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://app.launchdarkly.com/api/v2/flags/test-project',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Test Flag',
					key: 'test-flag',
					variations: [{ value: true }, { value: false }],
				},
				json: true,
			});
			expect(result).toHaveLength(1);
		});
	});

	describe('updateFlag', () => {
		it('should update a flag successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateFlag')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-flag')
				.mockReturnValueOnce('[{"op": "replace", "path": "/name", "value": "Updated Flag"}]');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				key: 'test-flag',
				name: 'Updated Flag',
			});

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://app.launchdarkly.com/api/v2/flags/test-project/test-flag',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: [{ op: 'replace', path: '/name', value: 'Updated Flag' }],
				json: true,
			});
			expect(result).toHaveLength(1);
		});
	});

	describe('deleteFlag', () => {
		it('should delete a flag successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteFlag')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-flag');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeFeatureFlagsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://app.launchdarkly.com/api/v2/flags/test-project/test-flag',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toHaveLength(1);
		});
	});
});

describe('Projects Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://app.launchdarkly.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllProjects', () => {
		it('should get all projects successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllProjects')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const mockResponse = {
				items: [
					{ key: 'project-1', name: 'Project 1' },
					{ key: 'project-2', name: 'Project 2' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getAllProjects error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllProjects')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getProject', () => {
		it('should get a project successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProject')
				.mockReturnValueOnce('test-project');

			const mockResponse = { key: 'test-project', name: 'Test Project' };

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getProject error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProject')
				.mockReturnValueOnce('invalid-project');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Project not found'));

			await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Project not found');
		});
	});

	describe('createProject', () => {
		it('should create a project successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createProject')
				.mockReturnValueOnce('New Project')
				.mockReturnValueOnce('new-project');

			const mockResponse = { key: 'new-project', name: 'New Project' };

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createProject error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createProject')
				.mockReturnValueOnce('Duplicate Project')
				.mockReturnValueOnce('duplicate-key');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Project key already exists'));

			await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Project key already exists');
		});
	});

	describe('updateProject', () => {
		it('should update a project successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateProject')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('[{"op": "replace", "path": "/name", "value": "Updated Project"}]');

			const mockResponse = { key: 'test-project', name: 'Updated Project' };

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle updateProject with invalid JSON patch', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateProject')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('invalid json');

			await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid JSON in patch parameter');
		});
	});

	describe('deleteProject', () => {
		it('should delete a project successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteProject')
				.mockReturnValueOnce('test-project');

			const mockResponse = {};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle deleteProject error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteProject')
				.mockReturnValueOnce('nonexistent-project');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Project not found'));

			await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Project not found');
		});
	});
});

describe('Environments Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAllEnvironments', () => {
		it('should get all environments successfully', async () => {
			const mockResponse = {
				items: [
					{ key: 'production', name: 'Production' },
					{ key: 'staging', name: 'Staging' },
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEnvironments')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://app.launchdarkly.com/api/v2/projects/my-project/environments',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				qs: {
					limit: 20,
					offset: 0,
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getAllEnvironments error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEnvironments')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getEnvironment', () => {
		it('should get environment successfully', async () => {
			const mockResponse = { key: 'production', name: 'Production' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEnvironment')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce('production');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://app.launchdarkly.com/api/v2/projects/my-project/environments/production',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createEnvironment', () => {
		it('should create environment successfully', async () => {
			const mockResponse = { key: 'test-env', name: 'Test Environment' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEnvironment')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce('Test Environment')
				.mockReturnValueOnce('test-env')
				.mockReturnValueOnce('#FF6B35');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://app.launchdarkly.com/api/v2/projects/my-project/environments',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Test Environment',
					key: 'test-env',
					color: '#FF6B35',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateEnvironment', () => {
		it('should update environment successfully', async () => {
			const mockResponse = { key: 'production', name: 'Updated Production' };
			const patchOperations = [{ op: 'replace', path: '/name', value: 'Updated Production' }];

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateEnvironment')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce('production')
				.mockReturnValueOnce(JSON.stringify(patchOperations));
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://app.launchdarkly.com/api/v2/projects/my-project/environments/production',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: patchOperations,
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteEnvironment', () => {
		it('should delete environment successfully', async () => {
			const mockResponse = {};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteEnvironment')
				.mockReturnValueOnce('my-project')
				.mockReturnValueOnce('test-env');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://app.launchdarkly.com/api/v2/projects/my-project/environments/test-env',
				headers: {
					'Authorization': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Segments Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://app.launchdarkly.com/api/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get all segments successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllSegments')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('test-tag');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      items: [{ key: 'segment1', name: 'Test Segment' }] 
    });

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://app.launchdarkly.com/api/v2/segments/test-project/test-env',
      headers: {
        'Authorization': 'test-key',
        'Content-Type': 'application/json',
      },
      qs: { tag: 'test-tag' },
      json: true,
    });
  });

  it('should get a single segment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('test-segment');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      key: 'test-segment', 
      name: 'Test Segment' 
    });

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://app.launchdarkly.com/api/v2/segments/test-project/test-env/test-segment',
      headers: {
        'Authorization': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should create a segment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('Test Segment')
      .mockReturnValueOnce('test-segment');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      key: 'test-segment', 
      name: 'Test Segment' 
    });

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://app.launchdarkly.com/api/v2/segments/test-project/test-env',
      headers: {
        'Authorization': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Test Segment',
        key: 'test-segment',
      },
      json: true,
    });
  });

  it('should update a segment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('test-segment')
      .mockReturnValueOnce([{ op: 'replace', path: '/name', value: 'Updated Segment' }]);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      key: 'test-segment', 
      name: 'Updated Segment' 
    });

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: 'https://app.launchdarkly.com/api/v2/segments/test-project/test-env/test-segment',
      headers: {
        'Authorization': 'test-key',
        'Content-Type': 'application/json',
      },
      body: [{ op: 'replace', path: '/name', value: 'Updated Segment' }],
      json: true,
    });
  });

  it('should delete a segment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('test-segment');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://app.launchdarkly.com/api/v2/segments/test-project/test-env/test-segment',
      headers: {
        'Authorization': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully when continueOnFail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('nonexistent-segment');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Segment not found'));

    const result = await executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Segment not found');
  });

  it('should throw error when continueOnFail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSegment')
      .mockReturnValueOnce('test-project')
      .mockReturnValueOnce('test-env')
      .mockReturnValueOnce('nonexistent-segment');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Segment not found'));

    await expect(
      executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Segment not found');
  });
});

describe('Experiments Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get all experiments successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllExperiments';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'limit': return 20;
        case 'offset': return 0;
        default: return '';
      }
    });

    const mockResponse = { items: [{ key: 'experiment1', name: 'Test Experiment' }], totalCount: 1 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get a single experiment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getExperiment';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'experimentKey': return 'experiment1';
        case 'expand': return '';
        default: return '';
      }
    });

    const mockResponse = { key: 'experiment1', name: 'Test Experiment' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should create experiment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createExperiment';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'name': return 'New Experiment';
        case 'description': return 'Test description';
        case 'maintainerId': return 'maintainer123';
        default: return '';
      }
    });

    const mockResponse = { key: 'experiment2', name: 'New Experiment' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should update experiment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateExperiment';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'experimentKey': return 'experiment1';
        case 'patch': return '[{"op": "replace", "path": "/name", "value": "Updated Name"}]';
        default: return '';
      }
    });

    const mockResponse = { key: 'experiment1', name: 'Updated Name' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should delete experiment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteExperiment';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'experimentKey': return 'experiment1';
        default: return '';
      }
    });

    const mockResponse = {};
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getExperiment';
        case 'projectKey': return 'test-project';
        case 'environmentKey': return 'test-env';
        case 'experimentKey': return 'nonexistent';
        default: return '';
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Experiment not found'));

    const result = await executeExperimentsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: { error: 'Experiment not found' }, pairedItem: { item: 0 } }]);
  });
});

describe('Users Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://app.launchdarkly.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllUsers', () => {
		it('should get all users successfully', async () => {
			const mockUsers = { items: [{ key: 'user1' }, { key: 'user2' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllUsers')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-environment')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUsers);

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockUsers, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting all users', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllUsers');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getUser', () => {
		it('should get a single user successfully', async () => {
			const mockUser = { key: 'user1', name: 'Test User' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUser')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-environment')
				.mockReturnValueOnce('user1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUser);

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockUser, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting a user', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getUser');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(
				executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('User not found');
		});
	});

	describe('searchUsers', () => {
		it('should search users successfully', async () => {
			const mockResults = { items: [{ key: 'user1' }], totalCount: 1 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchUsers')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-environment')
				.mockReturnValueOnce('test query')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResults);

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResults, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when searching users', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('searchUsers');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Search failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Search failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteUser', () => {
		it('should delete a user successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteUser')
				.mockReturnValueOnce('test-project')
				.mockReturnValueOnce('test-environment')
				.mockReturnValueOnce('user1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when deleting a user', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('deleteUser');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Delete failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(
				executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('Delete failed');
		});
	});
});
});
