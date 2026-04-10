# SportsWebsite Backend API Guide

This project now includes a Next.js-style backend route structure under `app/api/*`.

## Environment Variables

Create `.env.local` in this folder (template: `.env.local.example`):

- `SPORTS_API_KEY=...`
- `SPORTS_API_BASE_URL=https://www.thesportsdb.com/api/v2/json` (optional override)

`.env.local` is gitignored.

## Backend Route Structure

- `app/api/teams/route.js`
- `app/api/games/route.js`
- `app/api/players/route.js`
- `app/api/team/[id]/route.js`

Shared backend utilities:

- `lib/apiClient.js`
- `lib/apiResponse.js`
- `lib/normalizeTeam.js`
- `lib/normalizeGame.js`
- `lib/normalizePlayer.js`
- `lib/leagueMap.js`

## Endpoint List + Example URLs

- `GET /api/teams?sport=basketball&league=nba`
- `GET /api/games?date=2026-04-10&league=nba`
- `GET /api/players?teamId=133602`
- `GET /api/team/133602`

## Standard Response Format

All endpoints use a consistent envelope.

Success:

```json
{
  "status": "ok",
  "data": []
}
```

Error:

```json
{
  "status": "error",
  "message": "Missing required query param: date"
}
```

## Sample Responses

`GET /api/teams?sport=basketball&league=nba`

```json
{
  "status": "ok",
  "data": [
    {
      "id": "133602",
      "name": "Los Angeles Lakers",
      "abbrev": "LAL",
      "logo": "https://..."
    }
  ]
}
```

`GET /api/games?date=2026-04-10&league=nba`

```json
{
  "status": "ok",
  "data": [
    {
      "id": "220123",
      "date": "2026-04-10",
      "homeTeam": "Boston Celtics",
      "awayTeam": "Miami Heat",
      "score": { "home": 102, "away": 98 },
      "status": "FT"
    }
  ]
}
```

`GET /api/players?teamId=133602`

```json
{
  "status": "ok",
  "data": [
    {
      "id": "34145937",
      "name": "LeBron James",
      "teamId": "133602",
      "position": "Forward"
    }
  ]
}
```

`GET /api/team/133602`

```json
{
  "status": "ok",
  "data": {
    "id": "133602",
    "name": "Los Angeles Lakers",
    "abbrev": "LAL",
    "logo": "https://...",
    "stats": {
      "formedYear": "1947",
      "stadium": "Crypto.com Arena",
      "country": "USA",
      "website": "www.nba.com/lakers",
      "description": "..."
    }
  }
}
```
