#!/bin/bash

# Rollback script - manually invoke if needed
# Usage: ./scripts/rollback.sh <previous-image-tag>

PREV_TAG=$1

if [ -z "$PREV_TAG" ]; then
  echo "Error: no previous tag supplied"
  echo "Usage: $0 <image-tag>"
  exit 1
fi

IMAGE="${REGISTRY}/orion-api:${PREV_TAG}"

echo "[rollback] Reverting to: $IMAGE"

gcloud run services update orion-api \
  --image "$IMAGE" \
  --region us-central1 \
  --platform managed

echo "[rollback] Done. Monitor logs for stability."
