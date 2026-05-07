#!/usr/bin/env bash
# export-pptx.sh — Convert an HTML presentation to a fully EDITABLE PPTX
#
# Usage:
#   bash scripts/export-pptx.sh <path-to-html> [output.pptx] [--compact]
#
# Examples:
#   bash scripts/export-pptx.sh ./my-deck/index.html
#   bash scripts/export-pptx.sh ./presentation.html ./slides.pptx
#   bash scripts/export-pptx.sh ./presentation.html --compact
#
# How it works:
#   1. Starts a local HTTP server (fonts and assets need HTTP to load)
#   2. Uses Playwright to render each slide in a headless browser
#   3. Walks the DOM of each .slide and extracts every element's style
#   4. Maps each DOM node to a native python-pptx object:
#        - Text → editable textbox with correct font/size/color
#        - <img> / base64 LOGO → embedded picture shape
#        - <svg> → SVG picture shape
#        - Div with background → PPTX rectangle / rounded-rect / gradient
#   5. Assembles and saves the .pptx
#
# Result: all text is editable, all images are real picture shapes —
# nothing is a screenshot.
set -euo pipefail

# ─── Colors ────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}ℹ${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
err()   { echo -e "${RED}✗${NC} $*" >&2; }

# ─── Usage ──────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
    err "Usage: bash scripts/export-pptx.sh <path-to-html> [output.pptx] [--compact]"
    err ""
    err "Examples:"
    err "  bash scripts/export-pptx.sh ./my-deck/index.html"
    err "  bash scripts/export-pptx.sh ./presentation.html ./slides.pptx"
    err "  bash scripts/export-pptx.sh ./presentation.html --compact  # faster, 1280x720"
    exit 1
fi

# ─── Locate the Python script ───────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY_SCRIPT="$SCRIPT_DIR/export-pptx.py"

if [[ ! -f "$PY_SCRIPT" ]]; then
    err "Cannot find $PY_SCRIPT"
    err "Make sure export-pptx.py is in the same directory as this shell script."
    exit 1
fi

# ─── Locate Python ──────────────────────────────────────────
PYTHON_BIN="$(command -v python3 2>/dev/null || command -v python 2>/dev/null || true)"

if [[ -z "$PYTHON_BIN" ]]; then
    err "Python 3 is required but was not found."
    err ""
    err "Install Python:"
    err "  macOS:  brew install python"
    err "  Linux:  apt-get install python3 python3-pip"
    err "  or visit https://www.python.org/downloads/"
    exit 1
fi

PYTHON_VERSION=$("$PYTHON_BIN" --version 2>&1)
info "Using $PYTHON_VERSION"

# ─── Check / install Python dependencies ────────────────────
echo ""
info "Checking Python dependencies..."

NEED_INSTALL=false
for pkg in pptx playwright lxml PIL; do
    if ! "$PYTHON_BIN" -c "import $pkg" 2>/dev/null; then
        NEED_INSTALL=true
        break
    fi
done

if [[ "$NEED_INSTALL" == "true" ]]; then
    warn "Some packages are missing — installing now..."
    "$PYTHON_BIN" -m pip install --quiet --upgrade \
        "python-pptx>=1.0" playwright lxml pillow || {
        err "pip install failed."
        err ""
        err "Try manually:"
        err "  pip install \"python-pptx>=1.0\" playwright lxml pillow"
        exit 1
    }
    ok "Packages installed"
else
    ok "All Python packages present"
fi

# ─── Ensure Playwright's Chromium browser is available ──────
if ! "$PYTHON_BIN" -c "
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    p.chromium.executable_path  # will raise if not installed
" 2>/dev/null; then
    info "Downloading Chromium for Playwright (one-time, ~150 MB)..."
    "$PYTHON_BIN" -m playwright install chromium || {
        err "Failed to install Chromium."
        err ""
        err "Try manually:"
        err "  python -m playwright install chromium"
        err ""
        err "If you are behind a firewall, try a different network."
        exit 1
    }
    ok "Chromium ready"
else
    ok "Chromium already installed"
fi

echo ""

# ─── Run the Python exporter ────────────────────────────────
"$PYTHON_BIN" "$PY_SCRIPT" "$@"
