# landhart.nl

Statische website voor hoveniersbedrijf Landhart. Gehost op Cloudflare Pages, broncode op GitHub. Deploy gaat automatisch bij elke push naar `main` via GitHub Actions.

## Lokaal bekijken

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push naar `main` triggert de workflow in `.github/workflows/deploy.yml`, die de site naar Cloudflare Pages-project `landhart` deployt.

## Nog in te vullen

- Project-foto's vervangen in `index.html` onder `#projecten`
- Optioneel: KvK-nummer toevoegen wanneer gewenst (footer + JSON-LD)
- Google Business Profile claimen (via google.com/business) — los van de site, maar belangrijkste lokale SEO-boost

## Structuur

```
index.html      hoofdpagina
style.css       styling (geen frameworks, vanilla CSS)
favicon.svg     icon
robots.txt      SEO crawl-regels
sitemap.xml     SEO sitemap
.github/workflows/deploy.yml   auto-deploy
```
