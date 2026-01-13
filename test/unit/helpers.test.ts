/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	parseTags,
	parseVariations,
	parseUserKeys,
	validateProjectKey,
	validateEnvironmentKey,
	validateFlagKey,
	buildQueryString,
} from '../../nodes/LaunchDarkly/utils/helpers';

describe('LaunchDarkly Helpers', () => {
	describe('parseTags', () => {
		it('should parse comma-separated tags', () => {
			const result = parseTags('tag1,tag2,tag3');
			expect(result).toEqual(['tag1', 'tag2', 'tag3']);
		});

		it('should trim whitespace from tags', () => {
			const result = parseTags('tag1 , tag2 , tag3');
			expect(result).toEqual(['tag1', 'tag2', 'tag3']);
		});

		it('should filter empty tags', () => {
			const result = parseTags('tag1,,tag2,');
			expect(result).toEqual(['tag1', 'tag2']);
		});

		it('should return empty array for empty string', () => {
			const result = parseTags('');
			expect(result).toEqual([]);
		});
	});

	describe('parseVariations', () => {
		it('should parse valid JSON variations', () => {
			const json = '[{"value": true}, {"value": false}]';
			const result = parseVariations(json);
			expect(result).toEqual([{ value: true }, { value: false }]);
		});

		it('should throw error for invalid JSON', () => {
			expect(() => parseVariations('invalid json')).toThrow();
		});

		it('should throw error for non-array JSON', () => {
			expect(() => parseVariations('{"value": true}')).toThrow('must be a JSON array');
		});
	});

	describe('parseUserKeys', () => {
		it('should parse comma-separated user keys', () => {
			const result = parseUserKeys('user1,user2,user3');
			expect(result).toEqual(['user1', 'user2', 'user3']);
		});

		it('should trim whitespace', () => {
			const result = parseUserKeys('user1 , user2 , user3');
			expect(result).toEqual(['user1', 'user2', 'user3']);
		});
	});

	describe('validateProjectKey', () => {
		it('should accept valid project keys', () => {
			expect(validateProjectKey('my-project')).toBe(true);
			expect(validateProjectKey('my_project')).toBe(true);
			expect(validateProjectKey('myproject123')).toBe(true);
		});

		it('should reject invalid project keys', () => {
			expect(validateProjectKey('My Project')).toBe(false);
			expect(validateProjectKey('my.project')).toBe(false);
			expect(validateProjectKey('')).toBe(false);
		});
	});

	describe('validateEnvironmentKey', () => {
		it('should accept valid environment keys', () => {
			expect(validateEnvironmentKey('production')).toBe(true);
			expect(validateEnvironmentKey('dev-env')).toBe(true);
		});

		it('should reject invalid environment keys', () => {
			expect(validateEnvironmentKey('Production Env')).toBe(false);
		});
	});

	describe('validateFlagKey', () => {
		it('should accept valid flag keys', () => {
			expect(validateFlagKey('my-feature-flag')).toBe(true);
			expect(validateFlagKey('enable_new_ui')).toBe(true);
		});

		it('should reject invalid flag keys', () => {
			expect(validateFlagKey('My Feature Flag')).toBe(false);
		});
	});

	describe('buildQueryString', () => {
		it('should build query string from object', () => {
			const params = { limit: 20, offset: 0, env: 'production' };
			const result = buildQueryString(params);
			expect(result).toEqual({ limit: 20, offset: 0, env: 'production' });
		});

		it('should filter undefined values', () => {
			const params = { limit: 20, offset: undefined, env: 'production' };
			const result = buildQueryString(params);
			expect(result).toEqual({ limit: 20, env: 'production' });
		});

		it('should return empty object for empty input', () => {
			const result = buildQueryString({});
			expect(result).toEqual({});
		});
	});
});
