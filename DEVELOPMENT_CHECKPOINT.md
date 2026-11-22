# Development checkpoint — 2026-11-12
Working copy: bez-kornei-development. Original migration folder on D: was not edited.
Current page: bez-korney-preview/index.html; source blocks: sketches; assembly.css/js are separate.
Hero review: upper portfolio link removed, lower link retained. Eyebrow 36px below rule. Image starts 108px below copy on desktop; no offset at <=720px. Visible AI label removed per user instruction. Hero image remains generated; do not describe it as a completed client project.
Intro: cache-busted GIF URL, static logo for reduced motion, 4.2s drawing playback, 7s safety exit. Browser checks passed for contacts, gallery navigation, price fold and FAQ. Reduced-motion browser test and mobile viewport test remain pending.
Desktop hero verified at 1265px with no horizontal overflow. No publishing, DNS or WordPress changes.
This archive contains the current preview, block sources and documentation, not all migration media/history.
Motion prototype: first screen rebuilt as edge-to-edge visual left (54%), text right (46%). Original generated interior is animated with a localized WebGL foliage displacement and subtle lighting; this is NOT a filmed/generated video. Pause/resume, reduced-motion static fallback, visibility/offscreen suspension and image fallback provided. Browser verified rendering and pause/resume at 1265px. Existing MOV clips reviewed, rejected as hero material (phone footage of installation); no originals changed. Source JS in sketches/hero-motion.js, copied by assemble-preview.py. Previous hero retained as sketches/bez-lounge-hero-before-motion.html. Other blocks not redesigned.
Hero revision: atelier descriptor moved into header right above rule; headline raised. Foliage motion amplitude increased for comparison. First-screen Discuss CTA retained pending visual review.

Hero review: removed all foliage displacement; fixed image with slowly moving warm light and soft shadow bands. Work link now before Discuss button in DOM and visual order.

Hero before/after — 2026-11-13: added generated empty-planter BEFORE frame, source sketches/assets/hero-before.png, copied to preview assets by assemble-preview.py. Original AFTER photo preserved. Dual-texture WebGL reveal rises bottom to top over 4.6 s after an 0.85 s hold, with broad soft irregular edge and fixed foliage. Original sofa/floor retained outside the planted region. Existing dynamic light/shadows retained. Added replay and status label; pause/resume retained. Start waits for intro dismissal and scene visibility. CSS masked fallback without WebGL; reduced-motion displays original static AFTER. JS syntax, simulated WebGL/CSS lifecycle (intro, finish, replay, pause, hidden tab, motion preference) and local asset references PASS. Full visual browser verification remains pending: headless browser could not produce a screenshot in this environment. No publishing/DNS/WordPress changes.

2026-11-13 second revision: fixed first-paint flash by making intro overlay visible in initial HTML and hiding main content with inline critical CSS until intro fade. No preloading old looping GIF in initial markup; assembly.js selects the playback image once. After intro disappears, hold empty interior 1s. Loop: reveal 7s, full-green hold 2s, reverse 5.5s, empty hold 1s (16.5s cycle). CSS fallback now also loops continuously. Replay and pause retained. Verified in live in-app browser: immediately after reload intro visible/main hidden; after intro main visible; replay empty state; green endpoint; reverse phase visually seen; new loop observed. Node syntax and timeline boundaries PASS. No publication.
Hero CTA alignment: Discuss button moved right; right edge matches header atelier descriptor. Browser measured difference 0px. Source fragment updated and page rebuilt.
Intro final hold: completed GIF frame extracted as brand-final.png; at 4.2s switch to still final frame, hold exactly 2s, then fade to page. Prevents GIF restarting during hold. Verified browser at 4.5s: final PNG visible/main hidden; after hold: intro hidden/main visible. Existing hero cycle timing retained.
Intro jump fix: do not replace GIF src with PNG. GIF control metadata now single playback, last frame 2000ms; actual total 5960ms. Retain overflow lock through overlay fade; stable scrollbar gutter prevents layout shift. GIF pixels unchanged. Syntax/metadata checked; browser verification timed out.
First/second screen wheel glide: threshold 65px accumulated input, 680ms ease, only hero-to-second and second-top-to-hero. Tall hero can scroll to final viewport before glide. Normal onward scrolling; controls/dialogs/nested scrollers and reduced motion excluded; pointer/touch/keyboard interrupt. JS state checks PASS (threshold, down/up destinations, onward normal scroll, reduced motion).
2026-11-13 layout revision: agreed rhythm across subsequent blocks alternates visual-left/text-right, text-left/visual-right, paired visuals and occasional full-width visual with overlaid text. Hero now immediately shows original full greenery, no before/after, status labels or replay. hero-light.js animates only soft sun/shade CSS layers, pauses offscreen/hidden tab, supports reduced motion and manual pause; no WebGL/RAF render loop. Second block rebuilt with copy left, edge-to-edge real photo right; responsive single column below 900px and compact spacing on short desktops. Content retained, image dialog retained. Browser checked 320/390/768/1280px: no second-block horizontal overflow, desktop two columns, smaller widths one column, removed hero controls count 0. No publication.
Full-screen fitostena viewer added with x2 zoom and scrollable detail view, click-to-zoom, native Escape/close and body scroll restoration. Browser confirmed dialog fills viewport, zoomed content 2404px vs viewport 1202px, closes normally. Discuss CTAs share cta.css organic shape, 175x120 dimensions, Georgia italic 26px, hover animation. Existing details/contact actions preserved.
Approved 2026-11-13: moderate far-left adjacent-room blur hero image accepted; installed in source and assembled assets (f6d6905c606b6420.jpg), original retained. Light was active but too subtle; sunrays now screen blend with 9s sweep and stronger soft shade. Browser verified animation running and transform changing, foreground remains static. Second desktop block compact benefit rows on short windows; measured 685.39px in 720px viewport, CTA completely visible with bottom clearance. CTA stacking: gray fill -1, terracotta outline 0, label 1. All eight sections now use wheel glides at boundaries, preserving long-section reading and reduced motion. VM navigation tests PASS down/down/long section/reverse/reduced-motion. No publication.
Second-screen adaptation corrected across desktop sizes, including tall wide windows: removed narrow title/lead/description limits, vertical spacing follows viewport height; flex copy keeps CTA at bottom with safe padding. Browser verified section fits 1920x950, 1536x864, 1366x768, 1280x720, CTA bottom clearance 38–40px. At 390px natural readable single-column scroll remains. User screenshot issue was width-only scaling and max-height:850 cutoff in previous rules.
Second-screen cleanup: removed O vybore and section number, replaced brand text with approved SVG logo at 150px. Removed objection border-top, retaining last benefit border as single rule. Removed screen numbering from all other section kicker labels, preserving project and process item numbers.
Email projects@bezkornei.ru added as mailto in all four expandable contact blocks: hero, artificial benefits, design partners and process. Existing footer address retained. Assembled page verified: 5 mailto links total.

2026-11-13: Added responsive breathing room and thin rule between second-screen logo and heading. Checked 1280x720: section 720px, closed CTA bottom 694px. Contact email added to all expandable discussion panels.

2026-11-13: Raised expanded second-screen contacts by reducing body top gap 18px to 4px; increased open-panel bottom padding to 40px.

2026-11-13: Replaced enlarged GIF playback with high-DPI vector canvas using approved root-to-K source. Simplified raster-trace stair steps and smoothed silhouette; final hold 1500ms, animation 4000ms. brand-intro.js generated via build-vector-intro.py. Second-screen desktop contact now reveals beside the button within existing CTA height, preventing photo stretch. Browser verified section 720px both closed/open; intro completes without console errors.

2026-11-13: Connected lower-left corner of Cyrillic B as a continuous path. Updated intro vector source and embedded logo SVGs; rebuilt intro and page.

2026-11-13: Added fine divider under intro brand, matching the measured atelier subtitle width; fades in with subtitle.

2026-11-13: Hero phone/email match second-screen typography, terracotta underline and stacked spacing. Intro divider now matches logo width.

2026-11-13: Intro divider aligned to original root silhouette lower edge using shared responsive drawing scale.

2026-11-13: Hero phrase uses terracotta Georgia italic; intro divider slightly darker (#b8b2a7).

2026-11-13: Updated hero lead to approved broader wording for all spaces.

2026-11-13: Hero photo starts at viewport top and fills height. Branding moved into text column. Desktop contact overlay uses bottom CTA area without resizing section. Root crown lowered to meet red K stem precisely. Future split visual/text sections must keep images edge-to-edge, branding within text.

2026-11-13: Logo and atelier subtitle grouped in all screen headers. Hero right aligned within right text column; left-column brand aligns left. Alignment rule recorded in AGENTS.md. Short-height second-screen spacing adjusted to accommodate subtitle.

2026-11-13: Removed second-screen image enlargement: static photo, no zoom dialog, trigger, hint, or magnifying cursor.

2026-11-13: Replaced specialist term dosvetka with clear wording: no watering or special lighting.

2026-11-13: Implemented third-screen photo showcase and separate asymmetric works page. Desktop gallery navigation/close and mobile no-overflow verified; all page assets return HTTP 200.

2026-11-14: Portfolio trial authorized: heading moved into lower-left seating caption over planter, graphite Уже and terracotta italic в пространстве. Removed logo recoloring filter; SVG bytes unchanged. No header band, original photos and hover scale/reduced-motion behavior retained.

2026-11-14: User reverted graphite portfolio heading/caption to white. Terracotta italic в пространстве and original logo colors retained.

2026-11-14: Separated portfolio heading from caption: heading higher/right on planter; caption restored to standard left gutter. Seating photo is static div without gallery trigger, hover retained. Wall remains an accessible button opening full-window gallery.

2026-11-14: Heading preposition в changed to white upright Arial; only пространстве remains terracotta Georgia italic.

2026-11-14: User requested small heading adjustment: desktop title from top 70% / left 15vw to top 67.5% / left 13.5vw (approximately 22px up and 16px left at 1101x883).

2026-11-14: User moved portfolio heading to top left and brand lockup to top right of right column, right-aligned. Mobile lockup follows wall photo in second row. Heading colors and logo SVG preserved.

2026-11-14: Portfolio desktop columns switched to 40% seating / 60% wall per user. Wall framing biased left at 20% to show relief sculpture; heading sized to narrower column.

2026-11-14: User rejected 40/60: planter too cropped. Trial revised to 50/50, right photo object-position 0% 50% to retain relief.

2026-11-14: Portfolio heading right-aligned inside left photo with standard right gutter; Уже aligns with the right edge of the second line.
