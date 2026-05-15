#!/usr/bin/env bash
# scripts/generate-pptx.sh — Generate a native PPTX using PptxGenJS
#
# Usage:
#   bash scripts/generate-pptx.sh                          # demo deck → output.pptx
#   bash scripts/generate-pptx.sh my-deck.pptx             # demo deck → my-deck.pptx
#   bash scripts/generate-pptx.sh --input spec.json        # from spec → output.pptx
#   bash scripts/generate-pptx.sh --input spec.json out.pptx
#
# Spec JSON format → see scripts/generate-pptx.js header comment
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
info() { echo -e "${CYAN}ℹ${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
err()  { echo -e "${RED}✗${NC} $*" >&2; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JS="$SCRIPT_DIR/generate-pptx.js"

# ── Resolve node ─────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  err "Node.js not found. Install it from https://nodejs.org"
  exit 1
fi

# ── Ensure pptxgenjs is resolvable ───────────────────────────────────────────
if ! node -e "require('pptxgenjs')" 2>/dev/null && \
   ! node -e "require('/opt/homebrew/lib/node_modules/pptxgenjs')" 2>/dev/null; then
  err "pptxgenjs not found. Install globally:"
  err "  npm install -g pptxgenjs"
  exit 1
fi

info "Node $(node --version)  |  PptxGenJS $(node -e "
  try { const p=require('pptxgenjs'); const x=new p(); console.log(x.version); }
  catch { const p=require('/opt/homebrew/lib/node_modules/pptxgenjs'); const x=new p(); console.log(x.version); }
" 2>/dev/null)"

node "$JS" "$@"
