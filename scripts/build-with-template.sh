#!/usr/bin/env bash
# scripts/build-with-template.sh
# Generate a PPTX with the company template applied to cover, chapter + closing slides.
#
# Usage:
#   bash scripts/build-with-template.sh <spec.json> [output.pptx] [template.pptx]
#
# Examples:
#   bash scripts/build-with-template.sh test/skills-research-2025-spec.json
#   bash scripts/build-with-template.sh test/my-spec.json my-deck.pptx
#   bash scripts/build-with-template.sh test/my-spec.json out.pptx assets/custom-template.pptx
#
# How it works:
#   1. PptxGenJS generates ALL slides (title + content + closing) from spec.json
#   2. apply-template.py:
#        a. Opens the company template PPTX
#        b. Fills the template cover slide (slide 1) with title/subtitle/date
#           from the spec
#        c. Copies content slides (skipping PptxGenJS title + closing), replacing
#           divider slides with the template slide 2 Chapter layout
#        d. Scales copied content coordinates to the template canvas (13.33" × 7.5")
#        e. Keeps the template closing slide
#        f. Deletes the original template example slides
#   3. Saves the final merged PPTX
set -euo pipefail

# ─── Colors ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'
YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'
info() { echo -e "${CYAN}ℹ${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
err()  { echo -e "${RED}✗${NC} $*" >&2; }

# ─── Resolve paths ───────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ─── Arguments ───────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
    err "Usage: bash scripts/build-with-template.sh <spec.json> [output.pptx] [template.pptx]"
    exit 1
fi

SPEC="$(realpath "$1")"
OUTPUT="${2:-output-with-template.pptx}"
TEMPLATE="${3:-${PROJECT_DIR}/中宏PPT模版.pptx}"

[[ -f "$SPEC"     ]] || { err "Spec file not found: $SPEC";         exit 1; }
[[ -f "$TEMPLATE" ]] || { err "Template file not found: $TEMPLATE"; exit 1; }

# Temporary file for PptxGenJS output (cleaned up on exit)
TMP_CONTENT="$(mktemp /tmp/pptxgen-content-XXXXXX.pptx)"
trap "rm -f '$TMP_CONTENT'" EXIT

echo -e "${BOLD}──────────────────────────────────────────────${NC}"
info "Spec     : $SPEC"
info "Template : $TEMPLATE"
info "Output   : $OUTPUT"
echo ""

# ─── Step 1: Generate all slides with PptxGenJS ──────────────────────────────
info "Step 1/2 — PptxGenJS: generating all slides..."
node "$SCRIPT_DIR/generate-pptx.js" --input "$SPEC" "$TMP_CONTENT"

# ─── Step 2: Apply company template ──────────────────────────────────────────
info "Step 2/2 — Applying company template..."
python3 "$SCRIPT_DIR/apply-template.py" \
    --template "$TEMPLATE"  \
    --input    "$TMP_CONTENT" \
    --output   "$OUTPUT"    \
    --spec     "$SPEC"

echo ""
ok "Done → $OUTPUT"
