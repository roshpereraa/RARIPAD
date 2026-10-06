# RARIPAD

The launchpad for coins on **Solana**, in the RARIPAD yellow-and-red livery.

Forked from [berrypad](https://github.com/roshpereraa/berrypad) (its Solana
branch) and re-skinned. The Solana layer in `src/lib/sol/` is carried over
untouched; everything changed here is brand, surface and motion.

RARIPAD launches and trades through **pump.fun's own on-chain program** and
deploys nothing of its own: every instruction is built with pump.fun's official
SDK ([`@pump-fun/pump-sdk`](https://www.npmjs.com/package/@pump-fun/pump-sdk)),
and every read goes straight to a Solana RPC from the browser. The chain code
lives in `src/lib/sol/`.

This is the launchpad slice of
[museagents](https://github.com/roshpereraa/museagents), and shares its Solana
stack: the live board, coin pages with buy/sell against the bonding curve, the
create-a-coin flow and creator-fee claims. Agent registry and agent profiles
are left out.

There is no backend and no database. The routes under `/api` exist only where
an upstream refuses cross-origin browser requests: `/api/rpc` fails over across
Solana endpoints, `/api/ipfs` forwards coin metadata to pump.fun's IPFS
endpoint, and `/api/swap` proxies Jupiter.

## Coins launched here

Every launch made on this site sends a 0 SOL marker to the **launch registry**,
a program-derived address with no private key:

```
PublicKey.findProgramAddressSync([Buffer.from('raripad-launch-registry')], PUMP_PROGRAM)
```

RARIPAD derives its **own** registry from its own seed, so its launches never
land in berrypad's list and berrypad's never land in this one.

The "Launched on RARIPAD" column on the home page is that address's
transactions, decoded — so the list of our own coins needs no database and
cannot be faked by someone funding an address. It reads the newest few hundred
registry transactions rather than a full index, and the column says so.

## Develop

```bash
npm install
npm run dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `SOLANA_RPC_URL` | Server-side. A private endpoint (Helius, Triton, QuickNode) tried first by `/api/rpc`; its key never reaches browsers. Comma-separate several. |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Set only to have browsers call a provider directly instead of the failover proxy. Defaults to `/api/rpc`. |
| `NEXT_PUBLIC_SOLANA_WS_URL` | WebSocket endpoint for the live feed's log subscription. |
| `NEXT_PUBLIC_RARIPAD_LAUNCH_REGISTRY` | Override the launch registry above, so a fork keeps its own. |
| `JUP_API_KEY` | A paid Jupiter key for `/api/swap`, used when a coin is priced in a token rather than SOL. |

The project token's mint is set in `src/lib/token.ts`, which is the one place
it lives. It is empty, so no address renders anywhere; fill it in and the chip
returns to the hero and the footer at once. The header deliberately no longer
carries it.

## Brand

Modena yellow is the ground, Rosso Corsa the only accent, carbon brackets the
page at the nav and the footer. Surfaces are "liquid glass". Display type is
cut Apple-style — SF on Apple devices, Inter elsewhere.

The prancing horse is traced to one even-odd path and lives in three places
that must be regenerated together: `public/horse.svg` (the mask every on-page
mark is painted from), `src/app/icon.svg` (the favicon) and
`src/components/Logo.tsx`. Motion — the hero speed tunnel, the asphalt seam the
cars lap across, the scroll tachometer and the section reveals — is decorative
and is switched off wholesale by `prefers-reduced-motion`.

Anything in a `NEXT_PUBLIC_` variable is public: restrict a keyed RPC endpoint
by origin.

## Layout

```
src/app/            routes: / (board), /launch, /token, /fees, /search, /legal/*
src/app/api/        the few server routes an upstream CORS policy forces
src/components/     UI — SpeedField is the animated hero, Logo the horse mark
src/lib/sol/        Solana: pump.fun instructions, live feed, events, quotes
src/lib/            cache, nav, the project token's mint
```
