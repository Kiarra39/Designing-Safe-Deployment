#!/bin/bash

# Health verification — run post-deploy
# Should be integrated into the pipeline but wasn't yet

TARGET_URL="${1:-http://localhost:3000}"

echo "[healthcheck] Pinging $TARGET_URL/health ..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/health")

if [ "$RESPONSE" -eq 200 ]; then
  echo "[healthcheck] Service responding: HTTP $RESPONSE"
else
  echo "[healthcheck] Unexpected response: HTTP $RESPONSE"
  exit 1
fi
