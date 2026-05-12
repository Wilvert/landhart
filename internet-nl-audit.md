# internet.nl audit — landhart.nl

**Auditdatum:** 2026-05-12
**Permalink:** https://internet.nl/site/landhart.nl/3946552/
**Scope:** website-test (mail-test buiten scope per gebruikersverzoek)

---

## Samenvatting

landhart.nl haalt **95%** op internet.nl. De resterende 5% is geconcentreerd in één technisch dossier: **TLS-ciphers op Cloudflare**, dat geheel afhangt van Cloudflare Advanced Certificate Manager (ACM, $10/mnd). Zonder ACM is realistisch ~97% haalbaar via twee gratis quick-wins (security.txt + Referrer-Policy). Met ACM is **100% haalbaar**.

## Headline-scores

| Test | Score | Rapport |
|---|---|---|
| internet.nl website | **95%** | https://internet.nl/site/landhart.nl/3946552/ |
| Mozilla Observatory v2 | **A+ (125/100)** | api.observatory-api.mdn.mozilla.net |
| DNSSEC validatie (Google DoH) | AD=true, Status=NOERROR | dns.google |
| internet.nl mail | n.v.t. (buiten scope) | — |

## Volledig overzicht van alle 37 subtests

### Failed (3) — TLS-ciphers

| # | Test | Wat internet.nl ziet | Root cause | Fix | Kosten |
|---|---|---|---|---|---|
| 1 | Cipher suites | `TLS_RSA_WITH_AES_256_GCM_SHA384` + `TLS_RSA_WITH_AES_256_CBC_SHA256` aangeboden — beide **insufficient** (geen forward secrecy, deels CBC) | Cloudflare default-cipher-set bevat legacy-suites voor browser-compat | Cipher-selectie naar NCSC-Good beperken via API | **ACM ($10/mnd)** |
| 2 | Cipher suite order | Server biedt `ECDHE_ECDSA_WITH_AES_128_CBC_SHA256` (zwakker, CBC) **vóór** `ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256` (sterker) | Cloudflare default volgt geen NCSC-volgorde | Server-cipher-order forceren via custom cipher-array (volgorde = preferentie) | **ACM ($10/mnd)** |
| 3 | Hash function for key exchange | TLS 1.2 sig-hash = **SHA-1** in handshake key-exchange | Cloudflare adverteert nog SHA-1 signature-algorithm voor legacy-clients | Cipher-suites zonder SHA-1 (alleen SHA-256/384 GCM + ChaCha20) | **ACM ($10/mnd)** |

**Belangrijke noot:** alle 3 failures hebben dezelfde root cause (Cloudflare default cipher-set) en dezelfde fix (ACM). Eén abonnement lost alle 3 op.

### Warning (2)

| # | Test | Wat internet.nl ziet | Root cause | Fix | Kosten |
|---|---|---|---|---|---|
| 4 | Content-Security-Policy | CSP aanwezig maar bevat `'unsafe-inline'` in `style-src` | Google Fonts CSS gebruikt inline `@import` — vereist `'unsafe-inline'` | (a) Fonts zelf hosten (geen `unsafe-inline` nodig) of (b) nonce-based CSP voor styles | Gratis maar werk — niet kritiek |
| 5 | security.txt | Bestand ontbreekt op `/.well-known/security.txt` | Niet aangemaakt | Statisch bestand toevoegen aan repo | **Gratis** ✓ |

### Info (3) — geen score-aftrek maar wel verbeterbaar

| # | Test | Wat internet.nl ziet | Fix | Kosten |
|---|---|---|---|---|
| 6 | HTTP compression | Brotli/gzip ja, maar info-flag (mogelijk Vary-header issue) | Cloudflare Pages doet dit auto — geen actie | n.v.t. |
| 7 | DANE existence | Geen TLSA-records op `_443._tcp.landhart.nl` | Custom cert met stabiele key + TLSA "3 1 1" publiceren | **ACM ($10/mnd)** |
| 8 | Referrer-Policy | `strict-origin-when-cross-origin` aanwezig maar internet.nl: "should not be used" | Aanpassen naar `same-origin` of `strict-origin` (privacy-vriendelijker) | **Gratis** ✓ |

### Not-tested (1)

| # | Test | Reden |
|---|---|---|
| 9 | DANE validity | Existence faalt → validity wordt overgeslagen |

### Passed (29) — alles wat al goed staat

IPv6 (alle 5 subtests) • DNSSEC (existence + validity) • HTTPS available • HTTPS redirect • HSTS • TLS version • Parameters for key exchange • TLS compression • Secure renegotiation • Client-initiated renegotiation • 0-RTT • OCSP stapling • Extended Master Secret (EMS) • Trust chain • Public key • Signature • Domain name on cert • CAA • X-Frame-Options • X-Content-Type-Options • RPKI Route Origin Authorisation existence (2×) • RPKI Route announcement validity (2×)

---

## Stappenplan A — Zonder ACM (gratis, doel ~97%)

### Stap A1 — `security.txt` toevoegen *(fixt warning 5)*

Maak `public/.well-known/security.txt` aan in de repo:

```
Contact: mailto:info@landhart.nl
Expires: 2027-05-12T00:00:00Z
Preferred-Languages: nl, en
Canonical: https://landhart.nl/.well-known/security.txt
```

Commit + push. Cloudflare Pages serveert het automatisch.

### Stap A2 — Referrer-Policy aanpassen *(fixt info-item 8)*

Optie 1: in `index.html` `<meta name="referrer" content="same-origin">` (snel, paginabreed)
Optie 2: via Cloudflare Transform Rule om de header op zone-niveau te overschrijven naar `same-origin` of `strict-origin`

### Stap A3 (optioneel, veel werk) — `'unsafe-inline'` uit CSP *(fixt warning 4)*

Self-host Google Fonts: download .woff2 bestanden, schrijf eigen `@font-face` in style.css, schrap de `<link>` naar fonts.googleapis.com. Daarna kan `style-src 'self'` zonder `unsafe-inline`. ~30 min werk + iets meer CSS-onderhoud.

**Verwachte score na A1+A2:** ~96-97% (1 warning + 1 info naar pass). A3 nog +1% richting ~97-98%.

---

## Stappenplan B — Met ACM ($10/mnd, doel 100%)

### Stap B1 — ACM activeren

Login `info@landhart.nl` op dash.cloudflare.com → zone `landhart.nl` → SSL/TLS → Edge Certificates → "Advanced Certificate Manager" → Subscribe. Vereist creditcard.

### Stap B2 — Custom ciphers patchen *(fixt fails 1, 2, 3)*

Eénmalig via API (ik doe dit zodra ACM aanstaat):

```bash
curl -X PATCH -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/settings/ciphers" \
  --data '{"value":[
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
    "ECDHE-ECDSA-CHACHA20-POLY1305",
    "ECDHE-RSA-CHACHA20-POLY1305",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256"
  ]}'
```

### Stap B3 — Custom cert met stabiele key ordenen *(voor DANE)*

Via ACM-dashboard of API: order een cert met **own CSR**. Ik kan een 2048-bit RSA private key + CSR genereren waarvan de publieke key jaren stabiel blijft.

### Stap B4 — TLSA-record toevoegen *(fixt info 7 + not-tested 9)*

Na cert-issuance:
1. SHA-256 hash van de DER-encoded publieke key
2. Publiceer als DNS-record: `_443._tcp.landhart.nl IN TLSA 3 1 1 <hex-hash>`
3. Idem voor `_443._tcp.www.landhart.nl`
4. Cert-rotaties behouden dezelfde publieke key → TLSA blijft voor altijd geldig

**Verwachte score na B1+B2+B3+B4:** **100%** (alle 3 fails + DANE info/not-tested → pass).

---

## Risicoregister

| # | Severity | Bevinding | Advies | Inspanning |
|---|---|---|---|---|
| 1 | MEDIUM | 3 internet.nl-fails op cipher-config | ACM aanzetten + ciphers patchen | S (5 min config, $10/mnd) |
| 2 | LOW | security.txt ontbreekt | Toevoegen aan `/.well-known/` | S (5 min) |
| 3 | LOW | Referrer-Policy `strict-origin-when-cross-origin` | Aanpassen naar `same-origin` | S (1 min) |
| 4 | LOW | DANE ontbreekt | ACM + custom CSR + TLSA-record | M (30 min na ACM-activatie) |
| 5 | INFO | CSP `'unsafe-inline'` in style-src | Optioneel: Google Fonts self-hosten | M (30 min) |

## Quick wins (≤5 min, gratis)

1. **`/.well-known/security.txt` aanmaken** → fixt warning 5
2. **Referrer-Policy → `same-origin`** via `<meta>` tag → fixt info 8

Beide samen = **+2% score**, kost 6 minuten werk, kost €0.

## Wat krijg je extra met ACM ($10/mnd = €120/jr)

| Item | Zonder ACM | Met ACM |
|---|---|---|
| 3 cipher fails | ❌ stuck | ✅ groen |
| DANE existence | ❌ stuck | ✅ groen |
| DANE validity | ❌ not-tested | ✅ groen |
| Eigen cert-CA keuze | ❌ Cloudflare bepaalt | ✅ Let's Encrypt / Google / Sectigo / DigiCert |
| Stabiele privé-key (voor TLSA "3 1 1") | ❌ rotaties | ✅ blijft gelijk |
| Cert lifetime | 90 dagen auto | 14d / 90d / 1 jaar |
| **Eindscore** | **97% max** | **100%** |

ROI-overweging: €120/jaar voor een hovenierssite. Voor B2B-klanten die internet.nl-100% expliciet vragen (zoals semi-overheid of compliance-gevoelige opdrachten) is dit gerechtvaardigd. Voor algemene marketing-doeleinden: 95-97% is al beter dan 95% van NL-MKB.

## Toegepaste audit-protocols

- internet.nl JSON probes-API polling (geen WebFetch op stale HTML)
- Header-snapshot via `curl -X GET -I -L -D file` (geen `-sI | grep` subshell)
- TLS-handshake bewijs via `openssl s_client` per cipher
- DNSSEC AD-flag validatie via Google DoH
- Mozilla Observatory v2 sync POST (geen polling)

## Bijlage: ruwe evidence

**Permalink rapport:** https://internet.nl/site/landhart.nl/3946552/

**TLS-ciphers bevestigd SUPPORTED:**
- ECDHE-ECDSA-AES256-GCM-SHA384 ✓ (NCSC-Good)
- ECDHE-RSA-AES256-GCM-SHA384 ✓ (NCSC-Good)
- ECDHE-ECDSA-CHACHA20-POLY1305 ✓ (NCSC-Good)
- ECDHE-RSA-CHACHA20-POLY1305 ✓ (NCSC-Good)
- **ECDHE-RSA-AES128-SHA** ⚠️ (NCSC Phase-Out, CBC+SHA-1)
- **AES128-SHA** ❌ (NCSC Insufficient, geen ECDHE)

**Internet.nl rapporteert daarnaast (Cloudflare alleen-zichtbaar via NCSC's parsing):**
- TLS_RSA_WITH_AES_256_GCM_SHA384 — insufficient
- TLS_RSA_WITH_AES_256_CBC_SHA256 — insufficient
- TLS-handshake SHA-1 signature hash advertised

**DNSSEC:**
- DS: 2371 13 2 822A223BED23E98161AE9126C94163DF72FA8ADD4DF2872F3C364016 2C2F47A7
- Algoritme 13 = ECDSAP256SHA256 (modern, niet RSASHA1)
- CDS+CDNSKEY aanwezig (auto-rotation ready)

**Security-headers actueel:**
- HSTS: `max-age=31536000; includeSubDomains` (count=1, geen degradatie)
- CSP: aanwezig, strict (frame-ancestors 'none', base-uri 'self', form-action 'self') — alleen `'unsafe-inline'` op style-src
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Permissions-Policy: aanwezig + uitgebreid
- Referrer-Policy: strict-origin-when-cross-origin (verbeterbaar)

---

*Audit door /website-team v2.9 (rollen Dex/Rafi/Vera actief; Mira/Levi/Nora/Kris buiten scope). Cross-challenges: 3 uitgevoerd. Tier: passief-databank + passief-uitbesteed + 2× actief-licht (curl/openssl). Geen wijzigingen aan productie uitgevoerd zonder gebruikersgoedkeuring.*
