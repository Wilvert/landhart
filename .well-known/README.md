# Landhart `.well-known/` files

## security.txt — re-sign instructie

Het bestand `security.txt` is PGP-clearsigned en moet vóór `Expires` opnieuw ondertekend worden (anders verloopt het en weigeren scanners het te valideren).

**Source-of-truth (ongeondertekend):** `/home/wilvert/.config/landhart/security.txt.source`

**Signing key:** ed25519 keypair "Landhart <info@landhart.nl>"
- Fingerprint: `FA7BB4DAD373BC78A60B817C1D309806FA2F3784`
- Private keyring: `/home/wilvert/.config/landhart/gnupg/` (chmod 700)
- Public key: gepubliceerd op https://landhart.nl/.well-known/pgp-key.txt
- Key vervaldatum: 2028-05-11

### Re-sign procedure (jaarlijks)

```bash
export GNUPGHOME=/home/wilvert/.config/landhart/gnupg
cd /home/wilvert/projects/landhart

# 1. Update Expires-datum (binnen 1 jaar) in source
nano /home/wilvert/.config/landhart/security.txt.source
# Expires: 2028-05-12T00:00:00.000Z  ← +1 jaar t.o.v. vandaag

# 2. Re-sign
gpg --batch --yes \
  --local-user FA7BB4DAD373BC78A60B817C1D309806FA2F3784 \
  --clearsign \
  --output .well-known/security.txt \
  /home/wilvert/.config/landhart/security.txt.source

# 3. Verify
gpg --verify .well-known/security.txt

# 4. Commit + push
git add .well-known/security.txt
git commit -m "security.txt: re-sign with new Expires"
git push
```

### Key-rollover procedure (één keer per 2 jaar — voor 2028-05-11)

Als de signing-key zelf bijna verloopt:

```bash
export GNUPGHOME=/home/wilvert/.config/landhart/gnupg

# 1. Verleng de key (geen nieuwe key, behoud fingerprint)
gpg --edit-key FA7BB4DAD373BC78A60B817C1D309806FA2F3784
# > expire
# > 2y
# > save

# 2. Export nieuwe publieke key
gpg --armor --export FA7BB4DAD373BC78A60B817C1D309806FA2F3784 > /home/wilvert/projects/landhart/.well-known/pgp-key.txt

# 3. Re-sign security.txt (zie hierboven)
# 4. Commit + push
```

## pgp-key.txt

Publieke PGP-key van het signing-keypair. Door security.txt verwezen via `Encryption:`-veld. Beveiligingsonderzoekers kunnen hiermee versleutelde meldingen naar info@landhart.nl sturen.
