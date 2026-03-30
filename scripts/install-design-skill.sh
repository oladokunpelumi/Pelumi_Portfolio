#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
SOURCE_DIR="$ROOT_DIR/project-skills/visually-pleasing-websites"
DEST_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
DEST_DIR="$DEST_ROOT/visually-pleasing-websites"

if [ ! -f "$SOURCE_DIR/SKILL.md" ]; then
  echo "Missing source skill at $SOURCE_DIR" >&2
  exit 1
fi

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR/references"

cp "$SOURCE_DIR/SKILL.md" "$DEST_DIR/SKILL.md"
cp -R "$SOURCE_DIR/references/." "$DEST_DIR/references/"

printf 'Installed skill to %s\n' "$DEST_DIR"
