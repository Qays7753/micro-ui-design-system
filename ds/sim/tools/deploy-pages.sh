#!/usr/bin/env bash
# deploy-pages.sh — replace the gh-pages tree with the fresh PWA build.
# Usage: bash ds/sim/tools/deploy-pages.sh   (from the repo root)
# Requires: ds/sim/dist fresh (pnpm build inside ds/sim) and GH_TOKEN env.
set -euo pipefail
repo="$(cd "$(dirname "$0")/../../.." && pwd)"
dist="$repo/ds/sim/dist"
worktree="/home/z/my-project/gh-pages-deploy"

[ -f "$dist/index.html" ] || { echo "deploy-pages: dist/index.html missing — build first"; exit 1; }
[ -n "${GH_TOKEN:-}" ] || { echo "deploy-pages: GH_TOKEN not set"; exit 1; }

# A clean worktree of origin/gh-pages (create or sync).
if [ ! -e "$worktree/.git" ]; then
  git -C "$repo" worktree add "$worktree" origin/gh-pages
else
  git -C "$worktree" fetch origin gh-pages
  git -C "$worktree" checkout -B gh-pages FETCH_HEAD
fi

# Replace the whole tree (no source ever lives on gh-pages).
find "$worktree" -mindepth 1 -maxdepth 1 -not -name '.git' -exec rm -rf {} +
cp -R "$dist"/. "$worktree"/
touch "$worktree/.nojekyll"

git -C "$worktree" add -A
git -C "$worktree" commit -m "chore(gh-pages): deploy the simulation PWA (PLAN-SIM SA7أ)" --allow-empty
git -C "$worktree" push "https://x-access-token:${GH_TOKEN}@github.com/Qays7753/micro-ui-design-system.git" HEAD:gh-pages
echo "deploy-pages: pushed"
