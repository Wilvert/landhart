#!/usr/bin/env bash
# IndexNow-ping voor landhart.nl — meldt gewijzigde URL's direct aan Bing/Yandex/ChatGPT-index.
# Gebruik:  ./indexnow.sh                  → pingt de standaard-URL's (homepage)
#           ./indexnow.sh /pad /ander-pad  → pingt specifieke paden
set -euo pipefail

HOST="landhart.nl"
KEY="$(cat "$(dirname "$0")/.indexnow-key" 2>/dev/null | tr -d '[:space:]')"
[ -z "$KEY" ] && { echo "Geen sleutel gevonden in .indexnow-key"; exit 1; }

# Standaard: homepage. Argumenten overschrijven dit.
PATHS=("$@")
[ ${#PATHS[@]} -eq 0 ] && PATHS=("/")

# Bouw JSON-lijst van volledige URL's
URLS=$(printf '"https://%s%s",' "$HOST" "${PATHS[@]}" | sed 's/,$//')

BODY=$(cat <<JSON
{"host":"${HOST}","key":"${KEY}","keyLocation":"https://${HOST}/${KEY}.txt","urlList":[${URLS}]}
JSON
)

echo "Pingen: ${PATHS[*]}"
code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" --data "$BODY")
echo "IndexNow-respons: HTTP $code  (200/202 = geaccepteerd)"
