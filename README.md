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

Zoek in de bron op `[VUL IN` voor placeholders die met echte gegevens moeten worden vervangen:

- Telefoonnummer
- Adres / postcode / plaats
- Werkgebied (regio)
- KvK-nummer
- Naam eigenaar
- Project-foto's vervangen plaatsing in `index.html` `#projecten` sectie

## Structuur

```
index.html      hoofdpagina
style.css       styling (geen frameworks, vanilla CSS)
favicon.svg     icon
robots.txt      SEO crawl-regels
sitemap.xml     SEO sitemap
.github/workflows/deploy.yml   auto-deploy
```
