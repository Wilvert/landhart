# landhart.nl

Statische website voor hoveniersbedrijf Landhart. Gehost op GitHub Pages, achter Cloudflare (DNS en beveiligingsheaders), broncode op GitHub. Deploy gaat automatisch bij elke push naar `main` via GitHub Actions.

## Lokaal bekijken

```sh
./bouw.sh && python3 -m http.server 8000 -d dist
# open http://localhost:8000
```

## Deploy

Push naar `main` triggert de workflow in `.github/workflows/deploy.yml`, die `dist/` naar GitHub Pages uitrolt.

## Bouwen

`./bouw.sh` zet de bestanden die online horen in `dist/` en verkleint de CSS. Alleen `dist/` wordt uitgerold; voeg een nieuwe map of pagina dus ook daar toe.

## Design

Newsreader (koppen) en Inter (tekst), zelf gehost in `fonts/`. Kleuren staan bovenaan `style.css`. Geen externe diensten; de CSP (headerregel in Cloudflare) staat die straks ook niet toe.

## Nog optioneel later

- Google Business Profile claimen (google.com/business) — grootste lokale SEO-hefboom

## Structuur

```
index.html                       hoofdpagina (HTML + minimale vanilla JS)
style.css                        styling (vanilla CSS, geen frameworks)
favicon.svg                      icon
privacy/                         privacyverklaring
fonts/, images/, brand/          lettertypen, foto's, logo's
robots.txt                       SEO crawl-regels
sitemap.xml                      SEO sitemap
.github/workflows/deploy.yml     auto-deploy naar GitHub Pages
```
