# Pivot: clickable prototype

**Pivot** is an URGENT button for any emergency that needs a handy worker (plumber, electrician, mechanic, locksmith, AC technician…) in Lebanon and the Middle East.
You show the problem in a photo, the (simulated) AI says what's likely wrong, and the nearest **verified** worker arrives with the right tools at a price agreed **before** the job (tes3ira).

> Prototype for the USJ *Innovation & Design Thinking* final jury. All data is demo data and all people are fictional. The AI is scripted.

---

## How to open it

1. Double-click **`index.html`**. It's a single file with no internet, install or build step needed.
   Works offline in Chrome, Edge, Safari and Firefox (Chrome or Edge recommended on the projector laptop).
2. Use the top bar to switch between:
   - **Customer**: the customer app only
   - **Worker**: the worker app (Pivot Pro) only
   - **Demo (side-by-side)**: both phones. An action on one phone updates the other immediately.
3. On a real phone (screen narrower than 500 px) the app fills the screen with no phone frame.
   To switch between the customer and worker apps there, use *Profile → Switch to Pivot Pro* (or *Account → Switch to the customer app*).

**Two screens:** open the same file in two browser windows (e.g. press `C` in one and `W` in the other). They stay in sync, so the laptop can show the customer while the projector shows the worker.

**Never stuck:** if one side isn't shown on any screen, Pivot plays that side automatically.
For example, in Customer view the worker accepts by himself after a few seconds; in Worker view, Maya confirms the price and rates you automatically.
If anything looks odd, press **`R`** to reset.

---

## Language: English / عربي

Everything inside the phones is fully translated: every screen, all 11 AI diagnoses, worker cards, reviews, chat and quick replies, maps, toasts and countdowns. The Arabic is simple, everyday Lebanese (تسعيرة، اشتراك، موتير، «يلّا، المساعدة بالطريق»), shown right to left with Western digits. The only Latin text left is the brand **Pivot**, `$` prices and device markings drawn in the illustrations (e.g. `16A`, `12V`).

**Each phone has its own language**, and the job data stays in sync whatever each phone shows. Ways to switch during the demo:

- Press **`L`** (or the **عربي (both)** button in the top bar) to switch **both phones** at once. This is the *Arabic preset*.
- Use the small **EN ✓ · عربي** switch **under each phone** to switch just that phone. For example, show the customer in Arabic and the worker in English.
- Presenter panel (`D`) → **Language**: Arabic preset, English for both, or per phone.
- Inside the apps: *Profile → Language* (customer) or *Account → Language* (worker). This is the switch to use on a real phone.
- Open the file with `index.html?lang=ar` to start in Arabic (`?clang=ar` customer only, `?wlang=ar` worker only).

**Mum's simplified app** (*Profile → See Mum's simplified app*) opens in Arabic by default: one big «ساعدوني» button, made for parents and grandparents.

**Suggested demo moment (10 s):** after the English run, press `L` and say "and of course, for our parents, the whole app is in Arabic".

**Automated check:** `tests/arabic_check.js` (needs Node + Playwright) walks scenarios A–D end to end in Arabic in Demo view, every other tile's AI result, the side screens (history, profile, claim, book for later, earnings, Mum's app) at desktop and phone sizes. It fails if any Latin word is left anywhere on a phone screen. Last run: 243 screens, PASS.

```bash
node tests/arabic_check.js
```

---

## Presenter panel & shortcuts

Open the panel with **`D`**, the **Presenter** button, or by **tapping the Pivot logo 3 times** (also works on a phone).
It has: reset, scenario launcher, jump-to-any-step, fast mode, big text, view switch, and a **Language** section (Arabic preset for both phones, English for both, or each phone separately).

| Key | Action |
|---|---|
| `D` | Open / close presenter panel |
| `N` or `→` | **Next step** of the demo (does the next logical tap for you, on either phone) |
| `B` | Back on the phone you used last |
| `1` `2` `3` `4` | Start scenario **A / B / C / D** (opens at the photo step) |
| `R` | Reset everything (all connected windows) |
| `C` / `W` / `V` | Customer / Worker / Side-by-side view |
| `F` | Fast mode (shorter AI scan, matching and travel time) |
| `T` | Big text (for older users) |
| `L` | **Arabic preset**: both phones عربي ↔ both English |
| `Esc` | Close panel / popup |

### Scenarios

| | Scenario | Where (default) | Worker (starts from) | Fixed price |
|---|---|---|---|---|
| **A** | Water pouring through the ceiling from upstairs, 1:07 AM | **Home**: Achrafieh, Sassine St, Bldg 14, 3rd floor | Rami Haddad, plumber (Badaro, 2.1 km) | $45 |
| **B** | Generator (ishtirak) breaker keeps tripping, 9:42 PM | **Parents**: Zahle, Haouch el Omara (Maya books it for Mum & Dad) | Karim Nassar, electrician (Chtaura, 9.4 km) | $35 |
| **C** | Car won't start, 7:15 AM | **Current location**: Hamra, Makdessi St street parking | Joe Saliba, mobile mechanic (Clemenceau, 1.9 km) | $95 |
| **D** | Flat tire, no spare, 11:48 PM | **Current location**: Dbayeh, coastal highway, right shoulder | Hassan Mrad, roadside tire repair (Jal el Dib, 3.2 km) | $25 |

**Where is the emergency?** After the problem tile, Maya picks *My current location (GPS)*, *Home*, *Parents* or *Work*.
Home problems (leaks, generator, tank, AC, gas, locked out, solar) default to Home (B defaults to Parents). Car problems default to the current location.
The chosen place drives everything after that: the map (district names, roads, sea or Zahle hills, and the worker's start area), distance and ETA, the worker's alert ("Achrafieh, 2.1 km · from Badaro"), navigation, the arrival message, chat quick replies, job history and the follow-up screen.
Story for **B**: Maya is in Beirut, her parents are in Zahle. Karim calls Mum (Nawal) before arriving, the worker sees "Maya K. for her parents", and Pivot calls both of them the next day. That's the family feature in action.

Each of the other 7 tiles (burst pipe, solar inverter, locked out, AC in a heatwave, gas smell, water tank empty, other) also has its own photo, hotspots, diagnosis, safety steps, tools and fixed price.
**Upload your own photo** with *Take or upload a photo*: the image is shown and the scripted result for the chosen problem runs on top of it.

---

## 60-second live demo script (Scenario A, Demo view)

**Before you go on stage:** open `index.html`, press `V` (side-by-side) and then `R` (reset). Leave fast mode **off**; turn it on with `F` if you're short on time.
If a click goes wrong, press **`N`** and the demo moves on to the next step.

| Time | Do (left = customer, right = worker) | Say |
|---|---|---|
| 0:00 | **Press and hold URGENT** (1.5 s, the ring fills) | "It's 1 a.m. in Achrafieh. Water is pouring through Maya's ceiling from upstairs, and her usual plumber isn't answering. One button, held so you can't press it by accident." |
| 0:08 | Tap **Leak from the neighbours upstairs** → **Continue** (*Home, Achrafieh* is pre-selected) → **Use demo photo** | "No forms: what, where (her home is already selected), and a photo." |
| 0:14 | *(AI scans, result appears)* point at the hotspots | "Our AI spots the wet patch and the likely pipe joint above. It tells her what to do right now: switch off the electricity in that room. And it tells the worker what to bring: a moisture meter and a pipe repair kit." |
| 0:24 | Tap **Find a verified plumber now** → right phone shows the alert (*Achrafieh, 2.1 km · from Badaro*) → tap **Accept** | "The nearest verified plumber, 2 km away in Badaro, gets the photo, the diagnosis, the tools list and the fixed price. He keeps 100%: 0% commission, flat subscription." |
| 0:32 | Left: **See the fixed price** → **Accept tes3ira · $45** | "Verified ID, skills test, insured job. And the tes3ira is agreed before he comes: no surprises at the door." |
| 0:40 | Right: tick 2 tools → **On my way**. Left: **Track Rami** (or wait), then the chat quick reply **Ring the 3rd floor** if there's time | "He arrives with the right parts the first time, so no second trip to the shop. She follows him live." |
| 0:50 | Press **`N`** (arrived), **`N`** (working), **`N`** (complete), **`N`** (send), then left **Yes, it's fixed** → 5 ★ → **Submit** | "Before and after photo, same price as agreed. She rates him, and tomorrow we call her to check everything is OK. If something goes wrong, the job is insured." |
| 1:00 | Right phone shows ★★★★★ and **$50 earned, $0 commission** | "That's Pivot: urgent help you can trust, any time, anywhere in Lebanon." |

---

## Screenshots for the deck

`screenshots/` contains clean PNGs at 2× resolution (transparent corners around the phone frame):

- `01-urgent-button.png`: home with the press-and-hold URGENT button
- `02-emergency-grid.png`, `03-where-is-the-emergency.png`, `03a-photo-step.png`, `03b-photo-tips.png`
- `04-ai-scanning.png`, `05-ai-diagnosis-hotspots.png`, `05b-…safety-tools.png`, `05c-…price.png`
- `06-worker-incoming-alert.png`, `06b-matching.png`
- `07-worker-card.png`, `08-fixed-price-tes3ira.png`, `09-price-agreed.png`
- `10-worker-prep-checklist.png`, `11-live-tracking.png`, `12-worker-navigation.png`
- `13-chat-quick-replies.png`, `13b-call.png`
- `14-demo-side-by-side-incoming.png`, `15-demo-side-by-side-tracking.png` (full screen, both phones)
- `16-worker-complete-job.png`, `17-job-done-before-after.png`, `18-rating-and-tip.png`, `19-follow-up.png`
- `20-worker-rated.png`, `21-worker-earnings.png`, `22-insured-claim.png`, `23-worker-home.png`, `24-profile-family.png`
- `25/26/27-scenario-B/C/D-ai-….png`: AI results for the other three demo scenarios
- `29/30/31/32-B-parents-zahle-….png`: scenario B for Maya's parents in Zahle (where, tracking, worker navigation, worker alert)
- `29/30/31/32-D-highway-dbayeh-….png`: scenario D on the Dbayeh highway (GPS location)

`screenshots/ar/` has **the same screens in Arabic** (same file names), plus `28-mum-simplified-app.png` (Mum's one-button app) and `33-mixed-customer-arabic-worker-english.png` (each phone in its own language).

---

## What's in the prototype

**Customer:** press-and-hold URGENT button · Book for later (pick day and time) · emergency grid (11 problems) · *Where is the emergency?* (GPS / Home / Parents / Work) · photo step with tips · AI scan + diagnosis (hotspots, confidence, severity, safety actions, tools, price range, time) · matching · worker card (verified, insured, rating, distance, ETA) · fixed price (tes3ira) · live map tracking with ETA · chat with quick replies · call · share location · before/after · rating + tip · follow-up · insured claim · job history · profile with saved addresses and family members who can use the urgent button · big text · full Arabic (RTL), per phone.

**Worker (Pivot Pro):** online/offline · today's jobs · rating · subscription ($19/month, 0% commission) · verification badges · full-screen urgent alert with a 30 s countdown · prep checklist · navigation and status updates (On my way → Arrived → Working → Done), mirrored live on the customer phone · after photo + locked final price · rating received · earnings & reputation (Trusted Pro level, reviews).

Technical notes: one HTML file with inline CSS, vanilla JS and inline SVG illustrations (no photos, logos, fonts or map tiles from the internet). Two windows sync through `BroadcastChannel`, with a `localStorage` fallback.
