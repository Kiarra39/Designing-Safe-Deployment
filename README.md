# Designing-Safe-Deployment

Internal deployment system for the **Orion Platform** — Node.js API gateway managing customer-facing services across staging and production environments.

> Last updated by: @devops-infra-team  
> Pipeline status: partially migrated from Jenkins  
> Environment: GCP Cloud Run + GitHub Actions

---

## Overview

This repository contains the Orion API service and its associated deployment automation. The deployment pipeline was migrated from a legacy Jenkins setup approximately 6 months ago. Some stages are still being ported; others were written quickly to hit a deadline.

The CI/CD system handles:
- Building and packaging the application image
- Running deployment to production
- Managing environment configuration

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker
- Access to `.env` credentials (request from infra team)

### Local Setup

```bash
npm install
cp .env.example .env
npm start
```

Application runs on `http://localhost:3000`.

### Running Tests

```bash
npm test
```

### Docker

```bash
docker build -t orion-api .
docker run -p 3000:3000 --env-file .env orion-api
```

---

## Deployment

Deployments are triggered automatically on push to `main`. Manual deployments can be triggered via the Actions tab.

Refer to `.github/workflows/deployment.yml` for pipeline configuration.

---

## Project Structure

```
.
├── src/                  # Application source
├── tests/                # Test suite
├── scripts/              # Deployment and operational scripts
├── .github/workflows/    # CI/CD pipeline definitions
├── Dockerfile
├── package.json
└── .env.example
```

---

## Known Issues

- Health check endpoint returns 200 even during cold start (tracked internally)
- Staging deploy sometimes skips due to a condition — under investigation
- Log verbosity in production is set lower than staging (intentional)

---

## Contact

Infrastructure queries → #infra-platform (internal Slack)  
On-call rotation → PagerDuty escalation policy: `orion-prod`
