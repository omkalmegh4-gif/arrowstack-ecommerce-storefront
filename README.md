# Accessible E-Commerce Storefront

A React + TypeScript frontend project created for the Arrowstack Frontend Development Internship assignment.

## Objective
Help shoppers discover products, filter a catalog, manage a cart, and validate checkout details in an accessible responsive interface.

## Features
- Editorial-style responsive storefront and curated product collection
- Product search, category filters, and interactive favorites
- Shopping bag with item counts, quantity controls, remove actions, and live subtotal
- Validated demo checkout and order confirmation (no payment processing)
- Accessible controls, visible keyboard focus, and clear empty/success states
- Shopping information, shipping threshold, and returns messaging

## Tech stack
- React + TypeScript
- Vite development/build tooling
- CSS responsive layout
- Vitest + React Testing Library for automated tests

## Prerequisites
- Node.js 22.12+ recommended for this setup
- npm
- Git (for version control)

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Validate
```bash
npm test
npm run build
```
Record the actual output and any issues in `docs/TESTING.md`. Do not claim a test passed unless you ran it.

## Project limitations
- This is a frontend demonstration using local state and/or clearly identified mock data.
- No real payment processing, production API, user account backend, or server persistence is configured.
- Browser local storage (where used) is only for this demo; it is not a secure or shared database.

## Evidence to capture
- Desktop screenshot
- Mobile-width screenshot
- Main workflow video/GIF
- Test command output
- Accessibility keyboard-navigation notes
- Known bugs and limitations

## Submission
Push this folder to its own GitHub repository. See `docs/SUBMISSION.md`.
