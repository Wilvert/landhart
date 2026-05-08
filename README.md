# landhart.nl

Statische website voor hoveniersbedrijf Landhart. Gehost op Cloudflare Pages, broncode op GitHub. Deploy gaat automatisch bij elke push naar `main` via GitHub Actions.

## Lokaal bekijken

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push naar `main` triggert de workflow in `.github/workflows/deploy.yml`, die de site naar Cloudflare Pages-project `landhart` deployt.

## Afbeeldingen

Project- en filosofie-foto's komen via Unsplash CDN (zie `<img src="https://images.unsplash.com/...">` in `index.html`). Bij eigen foto's: zet ze in `/images/` en vervang de `src` + `srcset` URL's. Bewaar `aspect-ratio` 4/5 voor projecten, 3/4 voor de filosofie-foto.

## Design notes

- **Type**: Fraunces (display, italic accents) + DM Sans (body) — geladen via Google Fonts
- **Kleuren**: deep ink-green (`--ink: #0F1F11`) op cream (`--cream: #F4EEE0`), met chartreuse accent (`--accent: #C9F226`)
- **Filmgrain**: subtiele SVG noise-overlay via `body::before`
- **Reveal-animaties**: IntersectionObserver met `.reveal` class en `--d` delay variabele
- **Marquee**: continue horizontale scroll (CSS animation), gepauzeerd op `prefers-reduced-motion`
- **Projecten**: horizontale scroll-track met snap, wheel→horizontaal-conversie via JS

## Nog optioneel later

- Eigen project-foto's i.p.v. Unsplash placeholders
- Google Business Profile claimen (google.com/business) — grootste lokale SEO-hefboom
- KvK-nummer (als gewenst — momenteel bewust weggelaten)

## Structuur

```
index.html                       hoofdpagina (HTML + minimale vanilla JS)
style.css                        styling (vanilla CSS, geen frameworks)
favicon.svg                      icon (sprout in chartreuse)
robots.txt                       SEO crawl-regels
sitemap.xml                      SEO sitemap
.github/workflows/deploy.yml     auto-deploy naar Cloudflare Pages
```
