#!/bin/sh
# Checks that must pass before a commit to the website repo. Fast and offline.
#
# The glossary and its checker live in the APP repo, deliberately: Docs/glossary.md
# is the single source of truth, and a second copy of the rule list would drift
# exactly like a second copy of a string — which is the failure this tool exists
# to catch. See Docs/glossary.md in the app repo.
#
# Because the checker is in a sibling repo, it can legitimately be absent (fresh
# clone, repo moved, website checked out alone). That is a WARNING, never a
# failure: a hook that blocks commits over a missing unrelated repo gets disabled.
set -e

ROOT=$(cd "$(dirname "$0")/.." && pwd)
APP_REPO="${MYSM_APP_REPO:-$ROOT/../resale-snap v1.0.1}"
CHECKER="$APP_REPO/tools/glossary_check.py"
status=0

printf '\n[precommit] glossary terms\n'
if [ -f "$CHECKER" ]; then
    python3 "$CHECKER" --web "$ROOT" || status=1
else
    printf '  SKIPPED: glossary checker not found at\n    %s\n' "$CHECKER"
    printf '  Set MYSM_APP_REPO to the app repo to enable it. Not a failure.\n'
fi

if [ "$status" -ne 0 ]; then
    printf '\n[precommit] FAILED. Fix the above, or commit with --no-verify.\n\n'
else
    printf '[precommit] ok\n\n'
fi
exit "$status"
