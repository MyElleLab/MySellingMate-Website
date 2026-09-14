#!/bin/sh
# Installs the git hooks. Run once per clone:  sh tools/install-hooks.sh
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
HOOK="$ROOT/.git/hooks/pre-commit"
mkdir -p "$ROOT/.git/hooks"
cat > "$HOOK" <<'HOOK_EOF'
#!/bin/sh
# Installed by tools/install-hooks.sh — edit tools/precommit.sh, not this file.
exec sh "$(git rev-parse --show-toplevel)/tools/precommit.sh"
HOOK_EOF
chmod +x "$HOOK"
echo "installed: .git/hooks/pre-commit -> tools/precommit.sh"
