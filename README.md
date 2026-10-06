# RARIPAD

The launchpad for AI-agent tokens on Robinhood Chain (chainId 4663), in the
RARIPAD yellow-and-red livery.

Forked from [berrypad](https://github.com/roshpereraa/berrypad) and re-skinned:
the live launch board, token pages with buy/sell against the bonding curve, and
the create-a-coin flow are unchanged — the chain adapter, the ABIs and the
bonding-curve maths were not touched.

Everything is read from the chain in the browser — no backend and no database.
The one server-side piece is the `/rpc` rewrite in `next.config.mjs`, which
proxies the chain RPC same-origin to dodge an upstream CORS fault.

## Develop

```bash
npm install
npm run dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public bucket for token logo uploads. Defaults to the museagents bucket. |
| `RH_RPC_URLS` | Comma-separated RPC failover list (see `src/chain-adapter/config.ts`). |

The project token's own contract address is not an environment variable: it is
the single constant `RARIPAD_CA` in `src/lib/token.ts`, shown in the header,
the hero and the footer. **It still carries the address this fork inherited
from berrypad** — set it to the RARIPAD token, or empty it so the site shows
"CA · coming soon", before pointing anyone at the deployment.

## Brand

Modena yellow is the ground, Rosso Corsa is the only accent, carbon brackets
the page at the nav and the footer. Surfaces are "liquid glass": frosted cream
with a specular lip and a travelling highlight. Display type is cut Apple-style
— SF on Apple devices, Inter everywhere else, tracking pulled in hard.

The prancing horse is traced from the badge to one even-odd path and lives in
three places that must be regenerated together:

```
public/horse.svg        the mask every on-page mark is painted from
src/app/icon.svg        the favicon — horse on a yellow rounded square
src/components/Logo.tsx the component that masks horse.svg and sets the colour
```

Motion is part of the brand and all of it is decorative: the hero's speed
tunnel (`SpeedField`), the asphalt seam the cars lap across (`RaceStrip`), the
scroll tachometer and the section reveals (`Reveal`). Every one of them is
switched off wholesale by `prefers-reduced-motion`, at the foot of
`src/app/globals.css`.

## Layout

```
src/app/            routes: / (launchpad), /launch, /token, /legal/*
src/components/     UI — SpeedField is the animated hero, Logo the horse mark
src/lib/            chain reads, wagmi config, cache
src/chain-adapter/  chain config, ABIs, bonding-curve maths
```
