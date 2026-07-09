# Deployment Pipeline Analysis

## Problems in the original workflow

- The workflow triggered on every branch, which allowed unreviewed code to enter the release path.
- Validation happened after deployment logic, so broken builds and tests could still reach production.
- A single job mixed build, deploy, smoke test, and notification logic, making failures hard to isolate.
- There was no staging environment, no manual approval gate, and no production-safe handoff.
- No rollback path existed, so a failed verification step had no structured recovery action.
- Operational traceability was weak because the workflow did not record commit SHA, timestamps, and stage outcomes clearly.

## Required stage design

1. Validate
   - Checkout source
   - Install dependencies with npm ci
   - Build the application
   - Run linting
   - Run tests with coverage
   - Publish build artifacts

2. Security
   - Run dependency audit
   - Perform a secret scan placeholder
   - Fail fast on high-risk issues

3. Deploy to staging
   - Run only after validation and security pass
   - Deploy a staging-safe artifact
   - Execute smoke tests and health checks

4. Deploy to production
   - Require a manual approval via the GitHub environment protection rule
   - Run only after staging has passed

5. Verify and rollback
   - Verify the deployed service
   - Trigger rollback automatically if verification fails
   - Publish a summary with commit SHA, timestamp, and stage status

## Expected safeguards

- Sequential execution via needs ensures later stages cannot start until earlier ones pass.
- Production approvals prevent unreviewed releases.
- Build artifacts and summaries improve traceability.
- Failure-driven rollback makes the pipeline operationally safer.
