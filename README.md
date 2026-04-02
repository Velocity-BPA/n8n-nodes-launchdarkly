# n8n-nodes-launchdarkly

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with LaunchDarkly's feature management platform. With 6 comprehensive resources, it enables complete control over feature flags, projects, environments, user segments, experiments, and user management directly within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![LaunchDarkly](https://img.shields.io/badge/LaunchDarkly-API-405DE6)
![Feature Flags](https://img.shields.io/badge/Feature%20Flags-Enabled-green)
![A/B Testing](https://img.shields.io/badge/A%2FB%20Testing-Supported-orange)

## Features

- **Feature Flag Management** - Create, update, toggle, and delete feature flags with full configuration control
- **Project & Environment Control** - Manage LaunchDarkly projects and environments programmatically
- **User Segmentation** - Create and manage user segments for targeted feature rollouts
- **Experiment Automation** - Set up and manage A/B tests and feature experiments
- **User Management** - Track and manage users within your LaunchDarkly environment
- **Real-time Flag Updates** - Instantly modify flag states and targeting rules
- **Bulk Operations** - Process multiple flags, users, or segments in single workflows
- **Advanced Targeting** - Configure complex targeting rules and rollout strategies

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-launchdarkly`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-launchdarkly
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-launchdarkly.git
cd n8n-nodes-launchdarkly
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-launchdarkly
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your LaunchDarkly API access token | Yes |
| Environment | Default environment key (can be overridden per operation) | No |

## Resources & Operations

### 1. Feature Flags

| Operation | Description |
|-----------|-------------|
| Create | Create a new feature flag with targeting rules |
| Get | Retrieve feature flag details and configuration |
| Update | Modify flag settings, targeting, and variations |
| Delete | Remove a feature flag permanently |
| List | Get all feature flags for a project |
| Toggle | Enable or disable a feature flag |
| Update Targeting | Modify targeting rules without changing flag structure |

### 2. Projects

| Operation | Description |
|-----------|-------------|
| Create | Create a new LaunchDarkly project |
| Get | Retrieve project details and configuration |
| Update | Modify project settings and metadata |
| Delete | Remove a project and all associated data |
| List | Get all projects in your account |

### 3. Environments

| Operation | Description |
|-----------|-------------|
| Create | Create a new environment within a project |
| Get | Retrieve environment details and settings |
| Update | Modify environment configuration |
| Delete | Remove an environment permanently |
| List | Get all environments for a project |
| Reset API Key | Generate a new API key for an environment |

### 4. Segments

| Operation | Description |
|-----------|-------------|
| Create | Create a new user segment with targeting criteria |
| Get | Retrieve segment details and rules |
| Update | Modify segment targeting and inclusion rules |
| Delete | Remove a user segment |
| List | Get all segments for a project |
| Get Users | Retrieve users that match segment criteria |

### 5. Experiments

| Operation | Description |
|-----------|-------------|
| Create | Set up a new A/B test or feature experiment |
| Get | Retrieve experiment details and results |
| Update | Modify experiment parameters and settings |
| Delete | Remove an experiment |
| List | Get all experiments for a project |
| Start | Begin running an experiment |
| Stop | End an active experiment |
| Get Results | Retrieve experiment performance data |

### 6. Users

| Operation | Description |
|-----------|-------------|
| Create | Add a new user to LaunchDarkly |
| Get | Retrieve user details and flag evaluations |
| Update | Modify user attributes and custom properties |
| Delete | Remove a user from the system |
| List | Get all users in an environment |
| Get Flag Settings | Retrieve all flag values for a specific user |

## Usage Examples

```javascript
// Toggle a feature flag for gradual rollout
{
  "resource": "featureFlags",
  "operation": "update",
  "projectKey": "my-project",
  "flagKey": "new-checkout-flow",
  "environments": {
    "production": {
      "on": true,
      "targets": [
        {
          "values": ["beta-users"],
          "variation": 0
        }
      ],
      "rules": [
        {
          "variation": 0,
          "clauses": [
            {
              "attribute": "segmentMatch",
              "op": "segmentMatch",
              "values": ["early-adopters"]
            }
          ]
        }
      ],
      "fallthrough": {
        "rollout": {
          "variations": [
            {"variation": 0, "weight": 10000},
            {"variation": 1, "weight": 90000}
          ]
        }
      }
    }
  }
}
```

```javascript
// Create a user segment for A/B testing
{
  "resource": "segments",
  "operation": "create",
  "projectKey": "ecommerce",
  "body": {
    "name": "Premium Customers",
    "key": "premium-customers",
    "description": "Users with premium subscription",
    "rules": [
      {
        "clauses": [
          {
            "attribute": "subscription",
            "op": "in",
            "values": ["premium", "enterprise"]
          }
        ]
      }
    ]
  }
}
```

```javascript
// Start an experiment to test new feature
{
  "resource": "experiments",
  "operation": "create",
  "projectKey": "mobile-app",
  "environmentKey": "production",
  "body": {
    "name": "New Navigation Test",
    "key": "nav-experiment",
    "description": "Testing new navigation design",
    "maintainerId": "user-123",
    "flagKey": "new-navigation",
    "randomizationUnit": "user",
    "iterations": [
      {
        "hypothesis": "New navigation increases engagement",
        "primaryMetricKey": "click-through-rate",
        "treatments": [
          {
            "name": "control",
            "baseline": true,
            "allocationPercent": 50000
          },
          {
            "name": "new-nav",
            "allocationPercent": 50000
          }
        ]
      }
    ]
  }
}
```

```javascript
// Bulk update user attributes for personalization
{
  "resource": "users",
  "operation": "update",
  "projectKey": "personalization",
  "environmentKey": "production",
  "userKey": "user-456",
  "body": {
    "custom": {
      "plan": "enterprise",
      "region": "us-west",
      "signupDate": "2024-01-15",
      "featureUsage": ["analytics", "reporting", "api"]
    }
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or insufficient permissions | Verify API key and check token permissions in LaunchDarkly |
| 404 Not Found | Resource doesn't exist or wrong project/environment key | Confirm resource exists and check key spelling |
| 409 Conflict | Resource already exists or flag key collision | Use different key or update existing resource |
| 422 Unprocessable Entity | Invalid request payload or missing required fields | Validate request body against LaunchDarkly API schema |
| 429 Rate Limit Exceeded | Too many API requests in time window | Implement rate limiting or add delays between requests |
| 403 Forbidden | Insufficient permissions for operation | Check API key permissions and project access rights |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-launchdarkly/issues)
- **LaunchDarkly API Docs**: [docs.launchdarkly.com](https://docs.launchdarkly.com/home/connecting/api)
- **Feature Flag Best Practices**: [launchdarkly.com/blog](https://launchdarkly.com/blog/)