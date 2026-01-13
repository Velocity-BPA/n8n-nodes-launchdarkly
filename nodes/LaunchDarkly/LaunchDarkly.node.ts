/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

// Feature Flag
import { featureFlagOperations, featureFlagFields } from './actions/featureFlag/featureFlag.description';
import {
	createFeatureFlag,
	getFeatureFlag,
	getManyFeatureFlags,
	updateFeatureFlag,
	deleteFeatureFlag,
	toggleFeatureFlag,
	copyFeatureFlag,
} from './actions/featureFlag/featureFlag.execute';

// Targeting
import { targetingOperations, targetingFields } from './actions/targeting/targeting.description';
import {
	getFlagState,
	addUserTarget,
	removeUserTarget,
	updateFallthrough,
	updateOffVariation,
	updateTargeting,
} from './actions/targeting/targeting.execute';

// Segment
import { segmentOperations, segmentFields } from './actions/segment/segment.description';
import {
	createSegment,
	getSegment,
	getManySegments,
	updateSegment,
	deleteSegment,
	addUsersToSegment,
	removeUsersFromSegment,
} from './actions/segment/segment.execute';

// Environment
import { environmentOperations, environmentFields } from './actions/environment/environment.description';
import {
	createEnvironment,
	getEnvironment,
	getManyEnvironments,
	updateEnvironment,
	deleteEnvironment,
	resetSDKKey,
} from './actions/environment/environment.execute';

// Project
import { projectOperations, projectFields } from './actions/project/project.description';
import {
	createProject,
	getProject,
	getManyProjects,
	updateProject,
	deleteProject,
} from './actions/project/project.execute';

// User
import { userOperations, userFields } from './actions/user/user.description';
import {
	getUser,
	searchUsers,
	deleteUser,
} from './actions/user/user.execute';

// Audit Log
import { auditLogOperations, auditLogFields } from './actions/auditLog/auditLog.description';
import {
	getAuditLogEntry,
	getManyAuditLogEntries,
} from './actions/auditLog/auditLog.execute';

// Metric
import { metricOperations, metricFields } from './actions/metric/metric.description';
import {
	createMetric,
	getMetric,
	getManyMetrics,
	updateMetric,
	deleteMetric,
} from './actions/metric/metric.execute';

// Experiment
import { experimentOperations, experimentFields } from './actions/experiment/experiment.description';
import {
	createExperiment,
	getExperiment,
	getManyExperiments,
	updateExperiment,
} from './actions/experiment/experiment.execute';

// Webhook
import { webhookOperations, webhookFields } from './actions/webhook/webhook.description';
import {
	createWebhook,
	getWebhook,
	getManyWebhooks,
	updateWebhook,
	deleteWebhook,
} from './actions/webhook/webhook.execute';

// Team
import { teamOperations, teamFields } from './actions/team/team.description';
import {
	createTeam,
	getTeam,
	getManyTeams,
	updateTeam,
	deleteTeam,
	addTeamMembers,
	removeTeamMembers,
	getTeamMaintainers,
} from './actions/team/team.execute';

// Member
import { memberOperations, memberFields } from './actions/member/member.description';
import {
	inviteMember,
	getMember,
	getManyMembers,
	updateMember,
	deleteMember,
} from './actions/member/member.execute';

export class LaunchDarkly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LaunchDarkly',
		name: 'launchDarkly',
		icon: 'file:launchdarkly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with LaunchDarkly API for feature flag management',
		defaults: {
			name: 'LaunchDarkly',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'launchDarklyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audit Log',
						value: 'auditLog',
					},
					{
						name: 'Environment',
						value: 'environment',
					},
					{
						name: 'Experiment',
						value: 'experiment',
					},
					{
						name: 'Feature Flag',
						value: 'featureFlag',
					},
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Metric',
						value: 'metric',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'Targeting',
						value: 'targeting',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'featureFlag',
			},
			// Operations
			...featureFlagOperations,
			...targetingOperations,
			...segmentOperations,
			...environmentOperations,
			...projectOperations,
			...userOperations,
			...auditLogOperations,
			...metricOperations,
			...experimentOperations,
			...webhookOperations,
			...teamOperations,
			...memberOperations,
			// Fields
			...featureFlagFields,
			...targetingFields,
			...segmentFields,
			...environmentFields,
			...projectFields,
			...userFields,
			...auditLogFields,
			...metricFields,
			...experimentFields,
			...webhookFields,
			...teamFields,
			...memberFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				if (resource === 'featureFlag') {
					if (operation === 'create') {
						result = await createFeatureFlag.call(this, i);
					} else if (operation === 'get') {
						result = await getFeatureFlag.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyFeatureFlags.call(this, i);
					} else if (operation === 'update') {
						result = await updateFeatureFlag.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteFeatureFlag.call(this, i);
					} else if (operation === 'toggle') {
						result = await toggleFeatureFlag.call(this, i);
					} else if (operation === 'copy') {
						result = await copyFeatureFlag.call(this, i);
					}
				} else if (resource === 'targeting') {
					if (operation === 'getFlagState') {
						result = await getFlagState.call(this, i);
					} else if (operation === 'addUserTarget') {
						result = await addUserTarget.call(this, i);
					} else if (operation === 'removeUserTarget') {
						result = await removeUserTarget.call(this, i);
					} else if (operation === 'updateFallthrough') {
						result = await updateFallthrough.call(this, i);
					} else if (operation === 'updateOffVariation') {
						result = await updateOffVariation.call(this, i);
					} else if (operation === 'updateTargeting') {
						result = await updateTargeting.call(this, i);
					}
				} else if (resource === 'segment') {
					if (operation === 'create') {
						result = await createSegment.call(this, i);
					} else if (operation === 'get') {
						result = await getSegment.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManySegments.call(this, i);
					} else if (operation === 'update') {
						result = await updateSegment.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteSegment.call(this, i);
					} else if (operation === 'addUsers') {
						result = await addUsersToSegment.call(this, i);
					} else if (operation === 'removeUsers') {
						result = await removeUsersFromSegment.call(this, i);
					}
				} else if (resource === 'environment') {
					if (operation === 'create') {
						result = await createEnvironment.call(this, i);
					} else if (operation === 'get') {
						result = await getEnvironment.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyEnvironments.call(this, i);
					} else if (operation === 'update') {
						result = await updateEnvironment.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteEnvironment.call(this, i);
					} else if (operation === 'resetSDKKey') {
						result = await resetSDKKey.call(this, i);
					}
				} else if (resource === 'project') {
					if (operation === 'create') {
						result = await createProject.call(this, i);
					} else if (operation === 'get') {
						result = await getProject.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyProjects.call(this, i);
					} else if (operation === 'update') {
						result = await updateProject.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteProject.call(this, i);
					}
				} else if (resource === 'user') {
					if (operation === 'get') {
						result = await getUser.call(this, i);
					} else if (operation === 'search') {
						result = await searchUsers.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteUser.call(this, i);
					}
				} else if (resource === 'auditLog') {
					if (operation === 'get') {
						result = await getAuditLogEntry.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyAuditLogEntries.call(this, i);
					}
				} else if (resource === 'metric') {
					if (operation === 'create') {
						result = await createMetric.call(this, i);
					} else if (operation === 'get') {
						result = await getMetric.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyMetrics.call(this, i);
					} else if (operation === 'update') {
						result = await updateMetric.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteMetric.call(this, i);
					}
				} else if (resource === 'experiment') {
					if (operation === 'create') {
						result = await createExperiment.call(this, i);
					} else if (operation === 'get') {
						result = await getExperiment.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyExperiments.call(this, i);
					} else if (operation === 'update') {
						result = await updateExperiment.call(this, i);
					}
				} else if (resource === 'webhook') {
					if (operation === 'create') {
						result = await createWebhook.call(this, i);
					} else if (operation === 'get') {
						result = await getWebhook.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyWebhooks.call(this, i);
					} else if (operation === 'update') {
						result = await updateWebhook.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteWebhook.call(this, i);
					}
				} else if (resource === 'team') {
					if (operation === 'create') {
						result = await createTeam.call(this, i);
					} else if (operation === 'get') {
						result = await getTeam.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyTeams.call(this, i);
					} else if (operation === 'update') {
						result = await updateTeam.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteTeam.call(this, i);
					} else if (operation === 'addMembers') {
						result = await addTeamMembers.call(this, i);
					} else if (operation === 'removeMembers') {
						result = await removeTeamMembers.call(this, i);
					} else if (operation === 'getMaintainers') {
						result = await getTeamMaintainers.call(this, i);
					}
				} else if (resource === 'member') {
					if (operation === 'invite') {
						result = await inviteMember.call(this, i);
					} else if (operation === 'get') {
						result = await getMember.call(this, i);
					} else if (operation === 'getMany') {
						result = await getManyMembers.call(this, i);
					} else if (operation === 'update') {
						result = await updateMember.call(this, i);
					} else if (operation === 'delete') {
						result = await deleteMember.call(this, i);
					}
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
