#!/usr/bin/env bash
# Zet alleen de bestanden die online horen in dist/ en verkleint de CSS.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist; mkdir -p dist/.well-known
cp -r index.html 404.html script.js robots.txt sitemap.xml site.webmanifest humans.txt llms.txt llms-full.txt favicon.ico favicon.svg c75216060ea926e5bd09951197c99940.txt images brand fonts privacy dist/
cp .well-known/security.txt .well-known/pgp-key.txt dist/.well-known/
python3 - <<'P'
import re
t=open('style.css',encoding='utf-8').read()
t=re.sub(r'/\*.*?\*/','',t,flags=re.S)
t=re.sub(r'\s+',' ',t)
t=re.sub(r' ?([{};]) ?',r'\1',t).replace(';}','}')
open('dist/style.css','w',encoding='utf-8').write(t.strip())
P
