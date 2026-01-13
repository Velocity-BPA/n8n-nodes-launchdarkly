# n8n-nodes-launchdarkly

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for LaunchDarkly, the enterprise feature management platform. This node provides full integration with LaunchDarkly's REST API, enabling workflow automation for feature flag management, targeting rules, user segments, environments, projects, audit logging, metrics, experiments, webhooks, teams, and members.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Features

- **Feature Flags**: Create, read, update, delete, toggle, and copy feature flags
- **Targeting**: Manage targeting rules, user targets, fallthrough rules, and off variations
- **Segments**: Create and manage user segments with included/excluded users
- **Environments**: Manage environments and reset SDK keys
- **Projects**: Full project lifecycle management
- **Users**: Search, retrieve, and delete users
- **Audit Log**: Access audit log entries for compliance and debugging
- **Metrics**: Create and manage metrics for experimentation
- **Experiments**: Create and manage A/B tests and experiments
- **Webhooks**: Create and manage webhooks for event notifications
- **Teams**: Create and manage teams with member assignments
- **Members**: Invite, manage, and remove account members
- **Trigger Node**: Receive webhook events from LaunchDarkly

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-launchdarkly` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-launchdarkly
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-launchdarkly.zip
cd n8n-nodes-launchdarkly

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-launchdarkly

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-launchdarkly %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Access Token | String | Yes | LaunchDarkly API Access Token |

### Getting Your Access Token

1. Log in to your LaunchDarkly account
2. Go to **Account Settings** > **Authorization** > **Access Tokens**
3. Click **Create Token**
4. Choose the appropriate permissions (Read, Write, or Admin)
5. Copy the generated token

## Resources & Operations

### Feature Flags

| Operation | Description |
|-----------|-------------|
| Create | Create a new feature flag |
| Get | Get a specific feature flag |
| Get Many | List all feature flags in a project |
| Update | Update a feature flag (semantic patch) |
| Delete | Delete a feature flag |
| Toggle | Turn a flag on or off in an environment |
| Copy | Copy flag settings between environments |

### Targeting

| Operation | Description |
|-----------|-------------|
| Get Flag State | Get the current state of a flag in an environment |
| Add User Target | Add a user to a flag's targeting |
| Remove User Target | Remove a user from a flag's targeting |
| Update Fallthrough | Update the default rule for a flag |
| Update Off Variation | Update the off variation for a flag |
| Update Targeting | Update targeting rules |

### Segments

| Operation | Description |
|-----------|-------------|
| Create | Create a new user segment |
| Get | Get a specific segment |
| Get Many | List all segments |
| Update | Update a segment |
| Delete | Delete a segment |
| Add Users | Add users to a segment |
| Remove Users | Remove users from a segment |

### Environments

| Operation | Description |
|-----------|-------------|
| Create | Create a new environment |
| Get | Get a specific environment |
| Get Many | List all environments |
| Update | Update an environment |
| Delete | Delete an environment |
| Reset SDK Key | Reset the SDK key for an environment |

### Projects

| Operation | Description |
|-----------|-------------|
| Create | Create a new project |
| Get | Get a specific project |
| Get Many | List all projects |
| Update | Update a project |
| Delete | Delete a project |

### Users

| Operation | Description |
|-----------|-------------|
| Get | Get a specific user |
| Search | Search for users |
| Delete | Delete a user |

### Audit Log

| Operation | Description |
|-----------|-------------|
| Get | Get a specific audit log entry |
| Get Many | List audit log entries |

### Metrics

| Operation | Description |
|-----------|-------------|
| Create | Create a new metric |
| Get | Get a specific metric |
| Get Many | List all metrics |
| Update | Update a metric |
| Delete | Delete a metric |

### Experiments

| Operation | Description |
|-----------|-------------|
| Create | Create a new experiment |
| Get | Get a specific experiment |
| Get Many | List all experiments |
| Update | Update an experiment |

### Webhooks

| Operation | Description |
|-----------|-------------|
| Create | Create a new webhook |
| Get | Get a specific webhook |
| Get Many | List all webhooks |
| Update | Update a webhook |
| Delete | Delete a webhook |

### Teams

| Operation | Description |
|-----------|-------------|
| Create | Create a new team |
| Get | Get a specific team |
| Get Many | List all teams |
| Update | Update a team |
| Delete | Delete a team |
| Add Members | Add members to a team |
| Remove Members | Remove members from a team |
| Get Maintainers | Get team maintainers |

### Members

| Operation | Description |
|-----------|-------------|
| Invite | Invite new members |
| Get | Get a specific member |
| Get Many | List all members |
| Update | Update a member |
| Delete | Remove a member |

## Trigger Node

The **LaunchDarkly Trigger** node allows you to receive webhook events from LaunchDarkly. Configure a webhook in LaunchDarkly pointing to the n8n webhook URL.

### Supported Events

- Flag created, updated, deleted, on, off
- Project created, updated
- Environment created
- Segment created, updated
- Member invited, joined
- Experiment started, stopped
- Approval requested, approved

### Webhook Verification

The trigger supports HMAC-SHA256 signature verification for secure webhook delivery.

## Usage Examples

### Toggle a Feature Flag

```json
{
  "resource": "featureFlag",
  "operation": "toggle",
  "projectKey": "my-project",
  "featureFlagKey": "new-feature",
  "environmentKey": "production",
  "enabled": true
}
```

### Create a User Segment

```json
{
  "resource": "segment",
  "operation": "create",
  "projectKey": "my-project",
  "environmentKey": "production",
  "segmentKey": "beta-users",
  "name": "Beta Users",
  "description": "Users participating in the beta program"
}
```

### Search Audit Log

```json
{
  "resource": "auditLog",
  "operation": "getMany",
  "returnAll": false,
  "limit": 50,
  "filters": {
    "after": "2024-01-01T00:00:00Z"
  }
}
```

## LaunchDarkly Concepts

### Feature Flags

Feature flags (also known as feature toggles) allow you to enable or disable features in your application without deploying new code. LaunchDarkly provides:

- **Boolean flags**: Simple on/off toggles
- **Multivariate flags**: Multiple variations for A/B testing
- **Targeting rules**: Control which users see which variations

### Environments

Environments represent different stages of your deployment pipeline (e.g., development, staging, production). Each environment has its own SDK key and flag configurations.

### Segments

Segments are reusable groups of users that can be targeted across multiple flags. They support:

- **Included users**: Explicitly included user keys
- **Excluded users**: Explicitly excluded user keys
- **Rules**: Dynamic rules based on user attributes

### Semantic Patch

LaunchDarkly uses semantic patch format for flag updates, which provides atomic operations like `turnFlagOn`, `turnFlagOff`, `updateName`, etc.

## Error Handling

The node handles LaunchDarkly API errors gracefully:

| Error Code | Description |
|------------|-------------|
| 400 | Bad request - check your parameters |
| 401 | Unauthorized - verify your access token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - resource doesn't exist |
| 409 | Conflict - resource already exists |
| 429 | Rate limited - too many requests |

## Security Best Practices

1. **Use Service Tokens**: For production workflows, use service tokens instead of personal tokens
2. **Principle of Least Privilege**: Grant only the permissions needed
3. **Rotate Tokens**: Regularly rotate your access tokens
4. **Audit Access**: Monitor the audit log for unauthorized access

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
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

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [LaunchDarkly API Docs](https://apidocs.launchdarkly.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-launchdarkly/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [LaunchDarkly](https://launchdarkly.com/) for their excellent feature management platform
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The n8n community for their support and contributions
