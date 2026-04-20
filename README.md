# DataPlay

## League card image generation (Gemini)

This project can optionally show a banner image on league cards if a file exists at:

- `public/league-images/<leagueId>.png`

To generate **one image at a time** (cost control), run:

```bash
# PowerShell
$env:GEMINI_API_KEY="YOUR_KEY_HERE"
node scripts/generateLeagueImage.mjs 4443 "UFC"
```

Then reload the app; the image will appear on the card.

### Automatic (one missing image per run)

This command will find the **first featured league** (from `src/homepage.jsx`)
that does not yet have an image and generate exactly **one** image:

```bash
# PowerShell
$env:GEMINI_API_KEY="YOUR_KEY_HERE"
node scripts/generateNextLeagueImage.mjs
```

It also enforces a simple cooldown (default 60s) to avoid accidental repeated spend:

```bash
$env:LEAGUE_IMAGE_COOLDOWN_SECONDS="60"
node scripts/generateNextLeagueImage.mjs
```

To bypass the cooldown:

```bash
$env:FORCE="1"
node scripts/generateNextLeagueImage.mjs
```
