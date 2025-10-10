#!/usr/bin/env bash
# Minimal CI script: install deps, run tests, build image, smoke-test /books, clean up.

KEEP_CONTAINER=${KEEP_CONTAINER:-0}


set -Eeuo pipefail
# -E: ERR trap is inherited by functions/subshells
# -e: exit immediately on any error (non-zero status)
# -u: treat unset variables as errors
# -o pipefail: a pipeline fails if any command in it fails

IMAGE_NAME="book-management-api"
IMAGE_TAG="${1:-latest}"         # first arg is the tag; defaults to "latest"
CONTAINER_NAME="book-api-ci"
PORT=3000

cleanup() {
  # Remove the test container if it exists; ignore errors
  # Remove the test container only if not keeping it
  if [ "$KEEP_CONTAINER" != "1" ]; then
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT                 # always run cleanup on script exit (success or failure)

echo "==> npm ci"
npm ci                             # reproducible, clean install using package-lock.json (prefer over npm install in CI)

echo "==> npm run lint"
if ! npm run -s lint -- ;then
  echo "❌ Lint failed"; exit 1
fi
echo "✅ Lint passed"

echo "==> npm test"
if ! npm test; then
    echo "❌ TESTS FAILED - CI pipeline stopped"
    exit 1
fi
echo "✅ All tests passed"

echo "==> docker build ${IMAGE_NAME}:${IMAGE_TAG}"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

# Ensure no name clash from previous runs, then start fresh
cleanup

# Kill any process using port 3000 to avoid conflicts
echo "==> checking port ${PORT}"
if lsof -ti:${PORT} >/dev/null 2>&1; then
    echo "==> killing process on port ${PORT}"
    lsof -ti:${PORT} | xargs kill -9 >/dev/null 2>&1 || true
    sleep 1
fi

# Stop any containers that might be using port 3000
if docker ps >/dev/null 2>&1; then
    docker ps --filter "publish=${PORT}" --format "{{.Names}}" | xargs -r docker stop >/dev/null 2>&1 || true
else
    echo "==> Docker daemon not running, skipping container check"
fi

echo "==> docker run (port ${PORT})"
docker run -d --name "${CONTAINER_NAME}" -p "${PORT}:3000" "${IMAGE_NAME}:${IMAGE_TAG}" >/dev/null
# -d: detached
# --name: fixed container name (so we can kill it later)
# -p: host:container port mapping

echo -n "==> wait for app"
for i in {1..30}; do
  if curl -fs "http://localhost:${PORT}/books" >/dev/null 2>&1; then
    printf "\n==> GET /books OK\n"
    KEEP_CONTAINER=1   # keep it running after success
    exit 0
  fi
  printf "."
  sleep 0.5
done
printf "\nERROR: app did not become ready\n"
docker logs "${CONTAINER_NAME}" || true
exit 1