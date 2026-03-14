# Backend Data Shapes

These are the frontend-friendly response shapes used by backend routes.

## Team

```json
{
  "id": "133604",
  "name": "Los Angeles Lakers",
  "abbrev": "LAL",
  "logo": "https://...",
  "league": "NBA",
  "sport": "Basketball",
  "country": "USA",
  "stadium": "Crypto.com Arena",
  "foundedYear": 1947,
  "description": "..."
}
```

## Game

```json
{
  "id": "2083301",
  "date": "2026-02-01",
  "time": "20:00:00",
  "homeTeam": {
    "id": "133604",
    "name": "Los Angeles Lakers",
    "score": 110
  },
  "awayTeam": {
    "id": "133602",
    "name": "Boston Celtics",
    "score": 108
  },
  "status": "Final",
  "league": "NBA",
  "season": "2025-2026"
}
```

## Player

```json
{
  "id": "34145937",
  "name": "LeBron James",
  "teamId": "133604",
  "position": "Forward",
  "number": "23",
  "nationality": "USA",
  "thumb": "https://...",
  "cutout": "https://...",
  "height": "6 ft 9 in",
  "weight": "250 lb",
  "birthDate": "1984-12-30"
}
```
