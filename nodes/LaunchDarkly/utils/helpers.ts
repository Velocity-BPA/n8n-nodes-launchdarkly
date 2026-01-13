/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodePropertyOptions } from 'n8n-workflow';

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toKebabCase(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function processCollection(
	collection: IDataObject | undefined,
	fields: string[],
): IDataObject {
	const result: IDataObject = {};

	if (!collection) {
		return result;
	}

	for (const field of fields) {
		if (collection[field] !== undefined && collection[field] !== '') {
			result[field] = collection[field];
		}
	}

	return result;
}

export function addAdditionalFields(
	body: IDataObject,
	additionalFields: IDataObject,
): IDataObject {
	for (const [key, value] of Object.entries(additionalFields)) {
		if (value !== undefined && value !== '' && value !== null) {
			body[key] = value;
		}
	}
	return body;
}

export function parseVariations(variations: string | unknown[]): unknown[] {
	if (typeof variations === 'string') {
		try {
			const parsed = JSON.parse(variations);
			if (!Array.isArray(parsed)) {
				throw new Error('Variations must be a JSON array');
			}
			return parsed;
		} catch (e) {
			if ((e as Error).message?.includes('must be a JSON array')) {
				throw e;
			}
			throw new Error('Invalid variations JSON format');
		}
	}
	return variations;
}

export function parseUserKeys(userKeys: string | string[]): string[] {
	if (typeof userKeys === 'string') {
		return userKeys.split(',').map((key) => key.trim()).filter((key) => key);
	}
	return userKeys;
}

export function parseTags(tags: string | string[]): string[] {
	if (typeof tags === 'string') {
		return tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
	}
	return tags;
}

export function buildQueryString(query: IDataObject): IDataObject {
	const result: IDataObject = {};

	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== '' && value !== null) {
			if (Array.isArray(value)) {
				result[key] = value.join(',');
			} else {
				result[key] = value;
			}
		}
	}

	return result;
}

export function formatTimestamp(date: string | number | Date): number {
	if (typeof date === 'number') {
		return date;
	}
	return new Date(date).getTime();
}

export function validateProjectKey(key: string): boolean {
	const regex = /^[a-z][a-z0-9-_]*$/;
	return regex.test(key);
}

export function validateEnvironmentKey(key: string): boolean {
	const regex = /^[a-z][a-z0-9-_]*$/;
	return regex.test(key);
}

export function validateFlagKey(key: string): boolean {
	const regex = /^[a-zA-Z][a-zA-Z0-9._-]*$/;
	return regex.test(key);
}

export function buildSemanticPatchInstruction(
	kind: string,
	params: IDataObject,
): IDataObject {
	return {
		kind,
		...params,
	};
}

export const resourceOperationOptions: INodePropertyOptions[] = [
	{
		name: 'Feature Flag',
		value: 'featureFlag',
		description: 'Manage feature flags',
	},
	{
		name: 'Targeting',
		value: 'targeting',
		description: 'Manage flag targeting rules',
	},
	{
		name: 'Segment',
		value: 'segment',
		description: 'Manage user segments',
	},
	{
		name: 'Environment',
		value: 'environment',
		description: 'Manage environments',
	},
	{
		name: 'Project',
		value: 'project',
		description: 'Manage projects',
	},
	{
		name: 'User',
		value: 'user',
		description: 'Manage users',
	},
	{
		name: 'Audit Log',
		value: 'auditLog',
		description: 'View audit log entries',
	},
	{
		name: 'Metric',
		value: 'metric',
		description: 'Manage metrics',
	},
	{
		name: 'Experiment',
		value: 'experiment',
		description: 'Manage experiments',
	},
];

export function handleError(error: Error, operation: string): never {
	const message = error.message || 'Unknown error occurred';
	throw new Error(`LaunchDarkly ${operation} failed: ${message}`);
}
