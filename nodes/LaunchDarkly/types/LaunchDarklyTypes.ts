/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface ILaunchDarklyApiCredentials {
	accessToken: string;
}

export interface IFeatureFlag {
	key: string;
	name: string;
	description?: string;
	tags?: string[];
	variations: IVariation[];
	temporary?: boolean;
	clientSideAvailability?: {
		usingMobileKey?: boolean;
		usingEnvironmentId?: boolean;
	};
	defaults?: {
		onVariation: number;
		offVariation: number;
	};
}

export interface IVariation {
	value: boolean | string | number | object;
	name?: string;
	description?: string;
}

export interface IEnvironment {
	key: string;
	name: string;
	color: string;
	tags?: string[];
	defaultTtl?: number;
	secureMode?: boolean;
	defaultTrackEvents?: boolean;
	requireComments?: boolean;
	confirmChanges?: boolean;
}

export interface IProject {
	key: string;
	name: string;
	tags?: string[];
	includeInSnippetByDefault?: boolean;
	defaultClientSideAvailability?: {
		usingMobileKey?: boolean;
		usingEnvironmentId?: boolean;
	};
	environments?: IEnvironment[];
}

export interface ISegment {
	key: string;
	name: string;
	description?: string;
	tags?: string[];
	included?: string[];
	excluded?: string[];
	rules?: ISegmentRule[];
}

export interface ISegmentRule {
	clauses: IClause[];
	weight?: number;
	rolloutContextKind?: string;
	bucketBy?: string;
}

export interface IClause {
	attribute: string;
	op: string;
	values: (string | number | boolean)[];
	negate?: boolean;
}

export interface ITargetingRule {
	variation?: number;
	rollout?: {
		variations: { variation: number; weight: number }[];
		bucketBy?: string;
	};
	clauses: IClause[];
	description?: string;
	trackEvents?: boolean;
}

export interface IUser {
	key: string;
	email?: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	ip?: string;
	country?: string;
	anonymous?: boolean;
	custom?: Record<string, unknown>;
}

export interface IAuditLogEntry {
	_id: string;
	date: number;
	kind: string;
	name: string;
	description: string;
	shortDescription: string;
	member?: {
		_id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
	titleVerb?: string;
	title?: string;
	target?: {
		_links: Record<string, { href: string }>;
		name: string;
		resources: string[];
	};
}

export interface IMetric {
	key: string;
	name: string;
	kind: 'pageview' | 'click' | 'custom';
	description?: string;
	tags?: string[];
	selector?: string;
	urls?: { kind: string; url?: string; pattern?: string }[];
	eventKey?: string;
	successCriteria?: string;
	unit?: string;
	isNumeric?: boolean;
}

export interface IExperiment {
	key: string;
	name: string;
	description?: string;
	maintainerId?: string;
	iterations?: IIteration[];
}

export interface IIteration {
	_id?: string;
	hypothesis: string;
	status?: string;
	startDate?: number;
	endDate?: number;
	winningTreatmentId?: string;
	winningReason?: string;
	canReshuffleTraffic?: boolean;
	flags?: {
		[flagKey: string]: {
			_version: number;
			offVariation: number;
			rules: ITargetingRule[];
		};
	};
	primaryMetric: {
		key: string;
		isGroup?: boolean;
	};
	treatments: ITreatment[];
	secondaryMetrics?: { key: string; isGroup?: boolean }[];
	attributes?: string[];
	randomizationUnit?: string;
}

export interface ITreatment {
	_id?: string;
	name: string;
	baseline?: boolean;
	allocationPercent?: string;
	parameters?: {
		[flagKey: string]: { variation: number };
	};
}

export interface IPatchOperation {
	op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
	path: string;
	value?: unknown;
}

export interface ISemanticPatchInstruction {
	kind: string;
	[key: string]: unknown;
}

export interface IPaginatedResponse<T> {
	items: T[];
	totalCount: number;
	_links?: {
		next?: { href: string };
		self?: { href: string };
	};
}

export type LaunchDarklyResource =
	| 'featureFlag'
	| 'targeting'
	| 'segment'
	| 'environment'
	| 'project'
	| 'user'
	| 'auditLog'
	| 'metric'
	| 'experiment';
