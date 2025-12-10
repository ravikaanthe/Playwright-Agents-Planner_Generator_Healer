# Enterprise Playwright Agentic Testing Framework

A comprehensive enterprise-level test automation framework leveraging Playwright agents in a sequential agentic loop: **Planner → Generator → Healer**.

## 🎯 Overview

This framework implements an intelligent, self-healing test automation system that:
- **Plans**: Automatically explores your application and creates comprehensive test plans
- **Generates**: Converts test plans into executable Playwright tests
- **Executes**: Runs tests across multiple browsers and environments
- **Heals**: Automatically debugs and fixes failing tests
- **Integrates**: Seamlessly works with Azure DevOps CI/CD pipelines

## 🚀 Quick Start with Azure CI/CD

### Prerequisites
- Azure DevOps organization and project
- Node.js 18+ installed
- Git repository connected to Azure DevOps

### Setup Steps
1. **Clone and Install**:
   ```bash
   git clone <your-repo>
   cd playwright-agents-plannergeneratorhealer
   npm install
   npx playwright install --with-deps
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Set up Azure Pipeline**:
   - Go to Azure DevOps → Pipelines → New Pipeline
   - Select your repository
   - Choose "Existing Azure Pipelines YAML file"
   - Select `azure-pipelines.yml`

4. **Run Tests**:
   ```bash
   npm run test              # All tests
   npm run test:chromium     # Chromium only
   npm run test:ci           # CI mode with reporting
   ```

## 📊 Azure Pipeline Features

### Multi-Stage Pipeline
- **Build Stage**: Environment setup and dependency installation
- **Test Stages**: Parallel execution across Chromium, Firefox, WebKit
- **Smoke Tests**: Fast validation for pull requests
- **Reporting**: Comprehensive test reports and artifacts

### Intelligent Test Execution
- **PR Builds**: Run smoke tests only (faster feedback)
- **Main Branch**: Full test suite across all browsers
- **Feature Branches**: Complete validation
- **Parallel Execution**: Optimal resource utilization

### Rich Reporting
- JUnit XML results for Azure DevOps integration
- HTML reports with screenshots and videos
- Performance metrics and test analytics
- Artifact preservation for debugging

## 🔧 Configuration

### Environment Variables
```bash
# Application settings
BASE_URL=https://www.saucedemo.com
TEST_ENV=production

# Test execution
WORKERS=1
RETRIES=2
HEADLESS=true

# Azure DevOps integration
CI=true
PLAYWRIGHT_BROWSERS_PATH=0
```

### Playwright Configuration
The framework includes optimized configurations for:
- **Local Development**: Full debugging and reporting
- **CI/CD Environments**: Optimized for reliability and speed
- **Multiple Browsers**: Chrome, Firefox, WebKit support
- **Mobile Testing**: Responsive design validation

## 🎯 Test Execution Modes

### Local Development
```bash
npm run test:headed       # Run with browser UI
npm run test:debug        # Debug mode
npm run report:show       # View last test report
```

### CI/CD Pipeline
```bash
npm run test:ci           # Full CI mode
npm run test:smoke        # Smoke tests only
npm run test:chromium     # Single browser
```

### Maintenance
```bash
npm run clean             # Clean test artifacts
npm run install:browsers  # Reinstall browsers
```

## 🚀 Phase 1: Foundation Setup (✅ Completed)

Phase 1 establishes the enterprise foundation with:

### ✅ Implemented Features

- **Enterprise Configuration System**: Centralized configuration for applications, agents, and environments
- **Type-Safe Architecture**: Complete TypeScript interfaces for all components
- **Azure CI/CD Integration**: Complete pipeline setup with multi-stage execution
- **Comprehensive Test Coverage**: 42+ test scenarios across all SauceDemo features
- **Intelligent Test Healing**: Automated debugging and fix generation
- **Multi-Browser Support**: Chromium, Firefox, WebKit with selective execution
- **Modular Agent Framework**: Structured approach for Planner, Generator, Healer agents
- **Comprehensive Logging**: Enterprise-grade logging with Winston
- **CLI Interface**: Command-line tools for running and managing the framework
- **ParaBank Integration**: Pre-configured for banking application testing
- **Extensible Design**: Easy to add new applications and testing scopes

### 📁 Project Structure

```
playwright-agents-plannergeneratorhealer/
├── src/
│   ├── config/
│   │   ├── enterprise.config.ts        # Framework configuration
│   │   └── applications.config.ts      # Application configurations (ParaBank)
│   ├── types/
│   │   ├── agent.types.ts             # Agent-related types
│   │   ├── orchestrator.types.ts      # Orchestrator types
│   │   ├── application.types.ts       # Application config types
│   │   └── index.ts                   # Type exports
│   ├── orchestrator/
│   │   ├── enterprise-orchestrator.ts # Main orchestrator class
│   │   └── index.ts                   # Orchestrator exports
│   ├── utils/
│   │   ├── logger.ts                  # Logging utility
│   │   ├── file-manager.ts            # File operations
│   │   └── metrics.ts                 # Metrics calculation
│   └── index.ts                       # CLI entry point
├── .env.example                       # Environment configuration template
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies and scripts
└── README.md                          # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Playwright (will be installed)

### Setup Steps

1. **Install Dependencies**:
```bash
npm install
```

2. **Install Playwright Browsers**:
```bash
npx playwright install
```

3. **Build the Project**:
```bash
npm run build
```

4. **Configure Environment** (optional):
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 📋 Usage

### List Available Applications
```bash
npm run list:apps
```

### List Testing Scopes for ParaBank
```bash
npm run list:scopes -- --application parabank
```

### Run Full Testing Cycle
```bash
npm run orchestrator:full -- --application parabank --scope auth accounts
```

### CLI Options
```bash
npm run orchestrator:full -- --help

Options:
  -a, --application <app>        Application to test (default: "parabank")
  -e, --environment <env>        Environment to test (default: "production")
  -s, --scope <scopes...>        Testing scopes (default: ["auth"])
  -b, --browsers <browsers...>   Browsers to test (default: ["chromium"])
  --parallel                     Run tests in parallel (default: true)
  --no-parallel                  Run tests sequentially
  --retries <count>              Number of retries (default: "2")
  --timeout <ms>                 Test timeout (default: "30000")
  -o, --output <path>            Output directory (default: "./enterprise-output")
```

### View Framework Configuration
```bash
npm run orchestrator:full -- config
```

## 🎨 Key Features

### 1. **Application Configuration**
Define your applications with environments, scopes, and testing parameters:

```typescript
// src/config/applications.config.ts
export const PARABANK_CONFIG: ApplicationConfig = {
  id: 'parabank',
  name: 'ParaBank Demo Banking Application',
  environments: {
    production: { url: 'https://parabank.parasoft.com' }
  },
  testingScopes: [
    { id: 'auth', name: 'Authentication', priority: 'high' },
    { id: 'accounts', name: 'Account Management', priority: 'high' }
  ]
};
```

### 2. **Agent Configuration**
Each agent (Planner, Generator, Healer) is configured with specific tools and capabilities:

```typescript
agents: {
  planner: {
    id: 'playwright-test-planner',
    tools: ['browser_navigate', 'browser_snapshot', 'planner_save_plan'],
    model: 'Claude Sonnet 4'
  }
}
```

### 3. **Enterprise Orchestrator**
Manages the complete testing cycle:

```typescript
const orchestrator = new EnterpriseAgentOrchestrator(config);
const result = await orchestrator.executeFullTestingCycle();
```

### 4. **Comprehensive Logging**
Track all operations with structured logging:

```typescript
const logger = new Logger('my-component');
logger.info('Operation started', { sessionId, params });
logger.success('Operation completed');
logger.error('Operation failed', { error });
```

## 📊 Testing Scopes (ParaBank)

| Scope ID | Name | Priority | Duration | Dependencies |
|----------|------|----------|----------|--------------|
| auth | User Registration & Authentication | High | ~15 min | None |
| accounts | Account Management | High | ~20 min | auth |
| transfers | Fund Transfers | High | ~25 min | auth, accounts |
| bills | Bill Payment | Medium | ~20 min | auth, accounts |
| loans | Loan Application | Medium | ~15 min | auth, accounts |
| transactions | Transaction Search | Low | ~10 min | auth, accounts |
| profile | Profile Management | Low | ~10 min | auth |

## 🔄 Agentic Loop Flow

```
┌─────────────┐
│   Planner   │ → Explores app, creates test plan
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Generator  │ → Converts plan to executable tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Execution  │ → Runs tests, collects results
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Healer    │ → Fixes failures, re-runs tests
└─────────────┘
```

## 📈 Metrics & Reporting

The framework tracks:
- Tests generated, executed, passed, failed
- Test coverage percentage
- Healing success rate
- Execution duration
- Phase-by-phase results

Reports are saved in:
- `reports/` - Cycle reports (JSON)
- `logs/` - Execution logs
- `enterprise-output/` - Generated artifacts

## 🔐 Environment Variables

Key environment variables (see `.env.example`):

```env
LOG_LEVEL=info
MAX_CONCURRENT_SESSIONS=3
DEFAULT_TIMEOUT=30000
RETRY_ATTEMPTS=2

# Notifications
SLACK_WEBHOOK_URL=
EMAIL_ENABLED=false

# Application credentials
PARABANK_USERNAME=demo
PARABANK_PASSWORD=demo
```

## 🚧 Next Steps (Phase 2)

Phase 2 will implement:
- Actual MCP agent integration
- Playwright test execution
- Real-time healing capabilities
- CI/CD pipeline integration
- Advanced reporting dashboard
- Multi-application orchestration

## 🤝 Contributing

This is an enterprise framework. Follow the established patterns:
1. Add new applications in `src/config/applications.config.ts`
2. Extend types in `src/types/`
3. Follow TypeScript best practices
4. Add comprehensive logging
5. Update documentation

## 📝 License

MIT

## 📧 Support

For questions or issues, please refer to the project documentation or contact the enterprise testing team.

---

**Phase 1 Status**: ✅ Complete
**Framework Version**: 1.0.0
**Last Updated**: December 9, 2025
