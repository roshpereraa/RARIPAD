# I shipped a Solana launchpad in one session. The hard part wasn't the code.

Everyone building on Solana right now is making the same site.

Black background. One neon accent — purple, green, teal, pick your poison. A grid that fades out at the edges. Monospace numbers. A hero that says something about "the future of onchain."

You've seen it a hundred times. So has every single person you're trying to get to use your product.

That's the actual problem. Not the contracts. Not the RPC. The fact that your launchpad looks exactly like the four other launchpads open in their other tabs.

So when I built RARIPAD this week, I made one decision before I wrote a line of code: **the background is yellow.**

## Why yellow is a strategy, not a colour

Here's the thing about a black site with a neon accent. It's safe. Everything looks premium on black. Bad spacing looks intentional. Weak type looks moody. You can't really get it wrong, which is exactly why nobody gets it right — it all collapses into the same soup.

Yellow is not safe. Yellow is loud, and loud is unforgiving. Every bit of lazy spacing shows. Every muddy grey you were hiding on black suddenly screams. You have to actually design it.

But here's what you get back. Someone scrolls past a screenshot on X and they know it's you before they read a word. That's the entire game. That's branding.

Racing yellow with a red accent and a black prancing horse. Rosso Corsa for the buttons, carbon for the nav and the footer, Modena yellow for everything in between. Nobody in the memecoin space is doing racing livery. Now one of us is.

## The hard part: the thing you can't fake

I had the badge as a JPEG. Red background, black horse, 705 pixels wide.

I could have just slapped that image on the site. Most people do. Then your logo is a blurry rectangle on every retina screen and you can never change its colour, so your "brand mark" only works on one background and you end up designing the whole site around a limitation you created on day one.

Instead I traced it. Threshold the image, clean the JPEG noise, run a contour trace, and out comes a single vector path.

Why does that matter? Because now the mark is a **mask**, not a picture. One file. Paint it yellow on the black nav. Paint it black at 320 pixels in the hero. Paint it red if I want. And the highlights in the mane and tail are *holes* in the path — so whatever's behind the horse shows through them, exactly the way the real badge is cut.

One file. Any colour. Any size. Zero compromise.

That's twenty minutes of work that pays for itself every single time you add a page.

## Then I made the dumbest possible mistake

Let's be honest about this part, because everyone skips it.

RARIPAD is forked from berrypad, a launchpad I'd already built. So I cloned berrypad, reskinned the whole thing, deployed it, and it looked incredible.

One problem. I'd cloned the wrong branch.

berrypad's default branch is the EVM build — Solidity, wagmi, a completely different chain. The **Solana** build, the one that actually runs on pump.fun's program, was sitting on a second branch I never looked at.

So the beautiful yellow site I'd just shipped was talking to the wrong blockchain entirely.

Here's my point, and it's not "check your branches." It's this: **I found out because I went looking, not because something broke.** The site built. It deployed. It served a 200. Every automated check passed. If I'd trusted the green ticks and walked away, I'd have shipped a Solana launchpad that wasn't on Solana.

Your tooling tells you the code *ran*. It does not tell you the code is *right*. Those are different questions and only one of them has an automated answer.

## What actually runs underneath

RARIPAD doesn't deploy its own contracts. It launches and trades through **pump.fun's own on-chain program**, using their official SDK. Every instruction is built with their tooling, every read goes straight to a Solana RPC from the browser.

No backend. No database. No indexer I have to keep alive at 3am.

And one detail I'm genuinely proud of. Every coin launched through RARIPAD sends a 0 SOL marker to a program-derived address — an address with no private key, that nobody can sign for, me included.

Why bother? Because now "coins launched on RARIPAD" is just that address's transaction history, decoded in the browser. No database to maintain. No list I could quietly edit. And critically, **nobody can fake their way onto it** by sending it money, because the marker only lands in a transaction that genuinely ran a RARIPAD launch.

Trust that doesn't depend on trusting me. That's the whole point of building onchain, and most "onchain" products still just serve you a Postgres table.

## The moving parts, and why they're not decoration

The site has a lot of motion. A speed tunnel behind the hero drawn live on canvas. Cars lapping across a strip of asphalt between sections. A red tachometer needle across the top that tracks your scroll. Cards that travel in as they land.

All of it switches off completely if your browser says you prefer reduced motion. One media query, everything decorative stops.

That's not me being nice. If someone gets motion sick on your landing page, they don't file a bug report. They close the tab and you never find out you lost them. Accessibility isn't charity, it's not leaking customers.

## What I'd tell you to steal

**Pick the colour nobody in your category picked.** Then actually design it properly, because the loud one punishes laziness.

**Vector your logo on day one.** As a mask, not an image. The twenty minutes comes back every week.

**Go looking for what's broken.** A green build and a 200 response mean your code ran. Nothing more.

**If the chain can be your database, let it.** Less to run, and more worth trusting.

RARIPAD is live at **raripad.fun** — yellow, loud, and running on pump.fun's program.

Go look at what everyone else in your space has built. Then go build what's next.
