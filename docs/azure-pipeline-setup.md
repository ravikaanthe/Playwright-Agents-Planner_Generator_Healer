# Azure DevOps Pipeline Setup Guide

This guide will help you set up Azure DevOps CI/CD pipelines for your Playwright test automation project.

## Prerequisites

Before setting up the pipeline, ensure you have:

- **Azure DevOps Organization**: Access to an Azure DevOps organization
- **Project Repository**: Your Playwright project committed to Azure Repos or GitHub
- **Service Connections**: Proper permissions to create pipelines
- **Agent Pools**: Access to Microsoft-hosted agents or self-hosted agents

## Quick Setup Steps

### 1. Create Azure Pipeline

1. Navigate to your Azure DevOps project
2. Go to **Pipelines** > **New Pipeline**
3. Select your repository source (Azure Repos Git, GitHub, etc.)
4. Choose **Existing Azure Pipelines YAML file**
5. Select the `azure-pipelines.yml` file from your repository

### 2. Configure Pipeline Variables (Optional)

Go to **Pipelines** > **Your Pipeline** > **Edit** > **Variables** and add:

| Variable Name | Value | Description |
|---------------|--------|-------------|
| `BASE_URL` | `https://www.saucedemo.com` | Application base URL |
| `NODE_VERSION` | `20.x` | Node.js version |
| `VM_IMAGE` | `ubuntu-latest` | Agent VM image |
| `ENABLE_FIREFOX` | `true` | Enable Firefox tests |
| `ENABLE_WEBKIT` | `true` | Enable WebKit tests |

### 3. Set up Branch Policies (Recommended)

1. Go to **Repos** > **Branches**
2. Select your main branch (e.g., `main`)
3. Click **Branch policies**
4. Enable **Build validation**
5. Add your Playwright pipeline as a required build

## Pipeline Configuration Details

### Trigger Configuration

The pipeline is configured to trigger on:

```yaml
trigger:
  branches:
    include:
      - main
      - develop
      - feature/*
  paths:
    include:
      - tests/**
      - playwright.config.ts
      - package.json
```

### Pull Request Validation

PR validation runs smoke tests only:

```yaml
pr:
  branches:
    include:
      - main
      - develop
```

### Stage Breakdown

#### 1. Build Stage
- **Purpose**: Environment setup and dependency installation
- **Duration**: ~2-3 minutes
- **Actions**:
  - Install Node.js
  - Cache node_modules
  - Install npm dependencies
  - Install Playwright browsers

#### 2. Test Stages
- **Chromium Tests**: Always run (required)
- **Firefox Tests**: Skip on PR builds
- **WebKit Tests**: Skip on PR builds
- **Smoke Tests**: Run only on PR builds

#### 3. Reporting Stage
- **Purpose**: Consolidate and publish test results
- **Outputs**:
  - JUnit test results
  - HTML test reports
  - Screenshots and videos
  - Pipeline artifacts

### Agent Requirements

The pipeline uses `ubuntu-latest` by default, which includes:

- Node.js support
- Browser dependencies
- Modern PowerShell
- Docker support

## Customization Options

### Different Operating Systems

To run tests on different OS, update the `vmImage` variable:

```yaml
variables:
  vmImage: 'windows-latest'  # or 'macos-latest'
```

### Browser-Specific Pipelines

Create separate pipelines for different browsers:

```yaml
# chromium-only-pipeline.yml
- script: npm run test:chromium
  displayName: 'Run Chromium Tests Only'
```

### Environment-Specific Testing

Add different environments:

```yaml
variables:
  - group: 'Production-Variables'
  - name: 'BASE_URL'
    value: 'https://prod.saucedemo.com'
```

## Advanced Configuration

### Parallel Execution

Increase parallel test execution:

```yaml
strategy:
  matrix:
    chrome:
      browserName: 'chromium'
    firefox:
      browserName: 'firefox'
    webkit:
      browserName: 'webkit'
```

### Test Sharding

For large test suites, enable sharding:

```yaml
strategy:
  matrix:
    shard1:
      shardIndex: 1
      shardTotal: 4
    shard2:
      shardIndex: 2
      shardTotal: 4
```

### Security and Secrets

Store sensitive data in Azure Key Vault:

```yaml
- task: AzureKeyVault@2
  inputs:
    azureSubscription: 'Your-Service-Connection'
    KeyVaultName: 'your-keyvault'
    SecretsFilter: 'test-credentials'
```

## Monitoring and Alerting

### Test Result Notifications

Configure notifications for failed tests:

1. Go to **Project Settings** > **Service hooks**
2. Create webhook for **Build completed**
3. Configure Slack/Teams integration

### Performance Monitoring

Add performance tracking:

```yaml
- script: |
    npx playwright test --reporter=html,json
    # Parse JSON results for performance metrics
  displayName: 'Performance Analysis'
```

## Troubleshooting

### Common Issues

#### 1. Browser Installation Failures

```bash
Error: Executable doesn't exist at /home/vsts/.cache/ms-playwright
```

**Solution**: Ensure `npx playwright install --with-deps` runs successfully

#### 2. Permission Errors

```bash
Error: EACCES: permission denied
```

**Solution**: Use `sudo` for Linux agents or check file permissions

#### 3. Test Timeout Issues

```bash
Error: Test timeout of 30000ms exceeded
```

**Solution**: Increase timeout in `playwright.config.ts` or pipeline

### Debug Pipeline Issues

Enable debug logging:

```yaml
variables:
  system.debug: true
```

Check agent capabilities:

```yaml
- script: |
    echo "Agent capabilities:"
    printenv | grep AGENT
  displayName: 'Debug Agent Info'
```

### Performance Optimization

#### Cache Strategy

Optimize caching:

```yaml
- task: Cache@2
  inputs:
    key: 'playwright | "$(Agent.OS)" | package-lock.json'
    restoreKeys: |
      playwright | "$(Agent.OS)"
      playwright
    path: |
      node_modules
      ~/.cache/ms-playwright
```

#### Selective Test Execution

Run only changed tests:

```yaml
- script: |
    git diff --name-only HEAD~1 tests/ | xargs npx playwright test
  displayName: 'Run Changed Tests Only'
```

## Maintenance

### Regular Updates

1. **Weekly**: Review test results and failure trends
2. **Monthly**: Update Playwright and browser versions
3. **Quarterly**: Review pipeline performance and optimization

### Cleanup Tasks

Add cleanup jobs:

```yaml
- job: Cleanup
  condition: always()
  steps:
  - script: |
      # Clean up large artifacts
      find test-results -name "*.webm" -size +10M -delete
    displayName: 'Cleanup Large Files'
```

## Integration Examples

### Slack Notifications

```yaml
- task: SlackNotification@1
  condition: always()
  inputs:
    SlackApiToken: '$(SLACK_TOKEN)'
    Channel: '#qa-automation'
    Message: 'Playwright tests completed: $(Build.Result)'
```

### Teams Integration

```yaml
- task: PublishToAzureServiceBus@1
  inputs:
    azureSubscription: 'service-connection'
    messageBody: |
      {
        "buildResult": "$(Build.Result)",
        "testResults": "$(TEST_RESULT)",
        "buildUrl": "$(Build.BuildUri)"
      }
```

### Jira Integration

```yaml
- script: |
    # Update Jira ticket on test completion
    curl -X POST https://your-jira.atlassian.net/rest/api/2/issue/$(JIRA_TICKET)/transitions
  displayName: 'Update Jira Ticket'
  condition: and(succeeded(), variables.JIRA_TICKET)
```

## Security Best Practices

1. **Use Service Connections**: Never hard-code credentials
2. **Secure Variables**: Mark sensitive variables as secret
3. **Least Privilege**: Grant minimum required permissions
4. **Regular Audits**: Review pipeline permissions quarterly
5. **Secure Artifacts**: Limit access to test artifacts

## Support and Resources

- **Azure DevOps Documentation**: https://docs.microsoft.com/en-us/azure/devops/
- **Playwright CI Documentation**: https://playwright.dev/docs/ci
- **Community Support**: Azure DevOps Community forums
- **Training**: Microsoft Learn modules for Azure DevOps

## Next Steps

1. **Set up the basic pipeline** using `azure-pipelines.yml`
2. **Test the pipeline** with a simple commit
3. **Add environment-specific configurations**
4. **Configure notifications and monitoring**
5. **Optimize for your specific needs**

Remember to test your pipeline thoroughly in a development environment before deploying to production!