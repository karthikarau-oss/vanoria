# Vanoria

An interactive chocolate-house team preview, built with Next.js App Router APIs, TypeScript, Tailwind, GSAP ScrollTrigger, Framer Motion and Three.js. The supplied Sites starter uses Vinext/Vite to produce a Cloudflare-compatible Worker.

## Run

`npm install` then `npm run dev`. Validate with `npx tsc --noEmit` and `npm run build`.

## Implemented preview

- Animated 3D chocolate geometry in the opening, gift scene, flavour worlds and a persistent edge stream across all pages.
- Reversible scroll-controlled gift-box opening and bar emergence, six flavour worlds, cover/drain and drip transitions, chocolate snap.
- Six sample products, search/filter/sort, wishlist, product pages, local cart with quantity/removal, personal gift-box builder and recommendations.
- Add-to-bag 3D sequence: forming slab, wrapping, rotation, delivery toward the bag. Escape/skip still completes the requested add.
- Corporate/contact, account, legal and checkout pages honestly disclose disconnected services.
- `/animation-lab` contains twelve isolated progress-controlled motion studies; it is absent from production navigation.
- A read-only `list_vanoria_products` WebMCP tool is feature-detected.

## Status and launch requirements

This is a demonstration, not a production store. Sample product weights, prices, taste notes, ingredients and packaging must not be treated as approved catalogue data. Artwork details are in `public/vanoria/ASSETS.md`.

The user requested a publicly shareable team preview. A Sites project was registered as `appgprj_6aaf5f86283881919979a573a2732110`. Publishing has not completed: the installed Sites skill and hosting helper files disappeared from the local plugin cache during the session. Reuse the existing project; do not create a replacement.

`VANORIA_STORE_MODE` defaults to preview. Forms fail closed until services are configured; checkout is explicitly disabled. No payment success is fabricated. Browser-local bag data is a convenience only and must never supply authoritative checkout prices.

Supabase RLS schema: `supabase/migrations/001_store.sql`. Roles use trusted app metadata, never client-editable profile data. All tables default-deny; only owners can read their orders, only trusted staff can mutate commerce records. Service-role keys remain server-only. The schema has not been applied to a live project.

Razorpay test adapter: `lib/server/razorpay.ts`. It rejects non-test credentials and verifies payment/webhook HMACs. Before enabling checkout, implement server-priced order creation, authoritative inventory/tax/shipping calculations, transactional reservation, idempotent webhook handling, captured-payment verification, refunds and fulfilment. The adapter is intentionally not wired into the sample checkout.

Also required before launch: Supabase auth callback/session handling, protected admin CRUD, private Storage policies and upload flow, signed uploads, abuse/rate controls for public forms, approved legal/shipping policies, real product imagery, nutrition/allergens, delivery settings, verified mobile GPU profiling and actual device testing.

References: https://supabase.com/docs/guides/database/postgres/row-level-security and https://github.com/razorpay/razorpay-go/blob/master/documents/paymentVerification.md
