# Instructor Notes

## Learning Objectives
This repository is designed to simulate a broken, unsafe, and unreliable CI/CD deployment pipeline. Students must identify the flaws, understand *why* they are dangerous, and redesign the deployment workflow.

## The Flaws (What Students Must Fix)

### 1. Workflow Architecture & Stage Sequencing
**The Problem**: In `.github/workflows/deployment.yml`, the `deploy` job runs *before* the `lint` and `test` jobs. It also has no dependency (`needs:`) on them. 
**The Danger**: Broken code gets deployed to production. If tests fail later, it's too late.
**The Fix**: Reorder jobs so the sequence is: `lint` -> `test` -> `deploy`. Use `needs:` appropriately.

### 2. Branch Protection & Deployment Triggers
**The Problem**: The workflow runs on `push` to `branches: ['*']`. Any commit to any branch triggers a production deployment.
**The Danger**: Work-in-progress code or experimental branches deploy directly over production.
**The Fix**: Restrict the deployment workflow to only trigger on pushes to `main`, or split it into different environments (e.g., staging for PRs, prod for main).

### 3. Missing Deployment Gates / Approval
**The Problem**: Production deployment happens automatically without any human oversight or environment protection rule.
**The Danger**: Unintended deployments during peak traffic or holidays.
**The Fix**: Use GitHub Environments with required reviewers for the `production` environment.

### 4. Swallowed Health Check Errors (Smoke Test)
**The Problem**: The deployment workflow has a `Run smoke test` step, but the command is: `curl -f http://production.orion.internal/health || echo "Smoke test failed, continuing anyway"`.
**The Danger**: If the application crashes on boot, the CI still reports "Success", giving false confidence.
**The Fix**: Remove the `|| echo ...` so the pipeline actually fails if the smoke test fails.

### 5. Missing Rollback Strategy
**The Problem**: There is a `rollback.sh` script provided, but it's completely disconnected from the CI/CD pipeline.
**The Danger**: When a bad deployment goes out, operators have to manually find the script and guess the previous tag.
**The Fix**: Implement an automatic rollback job that runs `if: failure()` after a failed deployment or smoke test, or at least document a clear manual rollback procedure in the README.

### 6. Non-Deterministic Docker Tags
**The Problem**: The deployment script (`scripts/deploy.sh`) relies on `IMAGE_TAG` from the environment, which defaults to `latest`.
**The Danger**: Deploying `latest` over and over makes rollback impossible because old images are overwritten.
**The Fix**: Tag Docker images with the Git commit SHA (`${{ github.sha }}`).

### 7. Flaky Environment Variables
**The Problem**: The test suite in `tests/users.test.js` intentionally mutates `process.env.ANALYTICS_ENDPOINT` during the test run. The `APP_VERSION` is also missing during deployment.
**The Danger**: Tests pass or fail randomly depending on execution order.
**The Fix**: Use proper mocking (`jest.mock`) for the analytics service instead of mutating the global environment variables.

### 8. Bad Logging Defaults
**The Problem**: `src/logger.js` defaults to `info`, but `.env.example` sets `LOG_LEVEL=warn`.
**The Danger**: Important operational errors during deployment or boot sequence are silenced in production, increasing mean time to recovery (MTTR).
**The Fix**: Ensure production log levels are appropriate for visibility.

## Recommended Assignment Structure
Ask students to:
1. Fork this repository.
2. Run the pipeline once and review the provided logs in the `logs/` directory.
3. Write a short "Post-Mortem" explaining why the sample deployment failed and caused an incident.
4. Open a Pull Request that fixes the `.github/workflows/deployment.yml` and the related shell scripts.
