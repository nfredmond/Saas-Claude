#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-0.1.2}"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to install CARTO CLI."
  exit 1
fi

echo "Installing CARTO CLI (controlled pin): @carto/carto-cli@${VERSION}"
npm install -g "@carto/carto-cli@${VERSION}"

if ! command -v carto >/dev/null 2>&1; then
  echo "Install completed but 'carto' is not on PATH."
  exit 1
fi

echo "CARTO CLI path: $(command -v carto)"
carto --version

echo
echo "Auth step (interactive):"
echo "  carto auth login"
echo "Headless option:"
echo "  carto auth login --no-launch-browser"
echo
echo "Validation step:"
echo "  carto whoami --json"
