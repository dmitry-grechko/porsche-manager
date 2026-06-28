# Engine reference notes — Porsche 981 3.4 flat-six (MA1.21)

Water-cooled, mid-mounted, DOHC 24v, VarioCam Plus, two opposed banks of 3 cylinders.
Free image sources for this *exact* engine (bare MA1 top-end) are thin, so the geometry
is informed by the closest visible references plus the known shared 9A1/MA1 architecture.

## References gathered (saved in tools/gen/refs/)

- `gt3rs_bay_crop.jpg` / `gt3rs_bay.jpg` — **primary reference**.
  997 GT3 RS 3.8 engine bay (same water-cooled flat-six family / shared top-end layout
  as the 981 MA1). Source (Wikimedia Commons, CC):
  https://commons.wikimedia.org/wiki/File:2010_Porsche_997_GT3_RS_3.8_engine_bay.jpg
  Clearly readable in this shot, and what drove the geometry:
  - Large **black plastic intake plenum / cover** dominating the top, with the molded
    **"PORSCHE" script** + an inset metal badge plate, and a sculpted wavy top profile.
  - A **round black resonance / intake chamber housing** sitting top-center above the plenum.
  - **Alternator** at the front: silver cylindrical body with a finned/ribbed cooling end
    and a belt pulley.
  - **Oil filler** cap (round, off to one side) and assorted breather hoses.
  - Throttle/intake tubing entering from one rear corner.
  - Blue coolant expansion tank sits beside the engine (separate cooling component, not modeled here).

- `gt3rs_engine.jpg` — wider 997 GT3 RS rear 3/4 with engine lid open (context for plenum
  prominence). Source:
  https://commons.wikimedia.org/wiki/File:2010_Porsche_997_GT3_RS_3.8_drivers_door_and_engine_bonnet.jpg

- `boxster_s_2014_bay.jpg` — 2014 981 Boxster S (exterior; mid-engine packaging context).
  Source: https://commons.wikimedia.org/wiki/File:2014_Porsche_Boxster_S_(49670684062).jpg

## Web sources (text) used to confirm layout

- Flat6 Motorsports IPD 981 intake plenum — confirms the OEM 981 intake is a wide plastic
  plenum feeding both banks, factory 74 mm throttle body, "Y"/resonance geometry:
  https://flat6motorsports.com/products/ipd-competition-intake-plenum-981-cayman-boxster
- Pelican Parts / Design911 cam-cover & coil catalogs — confirm **3 cylinders per bank**
  (cam-cover gaskets split cyl 1-3 / 4-6) and **6 ignition coil packs** (one per cylinder):
  https://www.pelicanparts.com/cat/r_981c/elignt_ignition-coils
  https://www.design911.com/porsche/boxster-986-987-981/camshaft-parts/
- Planet-9 forum — 3.4 shared across 981 S / 991 Carrera; differences are intake/exhaust/tune:
  https://www.planet-9.com/threads/what-is-the-difference-between-the-boxster-s-and-911-3-4l-motors.88060/

## Additional references gathered for the MAJOR detail overhaul (2026-06)

The bare top-end with the canonical **twin-curved-runner intake "bridge"** is the
single most recognizable feature and is best documented on the M96/M97 family
(986/987/996/997), which shares the water-cooled flat-six top-end architecture
with the 981 MA1. New refs saved in `tools/gen/refs/`:

- `gt3_996_bay.jpg` — **NEW primary for the intake bridge & coolant/oil unions**.
  2005 996 GT3 engine bay. Source (Wikimedia Commons):
  https://commons.wikimedia.org/wiki/File:2005_Porsche_996_GT3_engine_bay.jpg
  Clearly readable:
  - **Central round air-distribution box** (throttle/resonance housing) top-center,
    with **two black plastic intake tubes** curving outward/down to each bank — the
    "bridge / moustache". **Metal ring clamps** where the rubber boots meet the box.
  - **Ribbed silver coolant union / pipe** crossing to the right, **oil filter
    housing** (cylindrical cap, "Filter Only OHF11S"), **gold/tan oil filler cap**
    top-right, **alternator** left-of-center.
- `gt3_nocover_1.jpg`, `gt3_nocover_2.jpg` — **NEW primary for the front accessory
  face**. 996 GT3 Cup engine, cover off. Sources (Wikimedia Commons):
  https://commons.wikimedia.org/wiki/File:Porsche_GT3_engine_without_cover_(6293635932).jpg
  https://commons.wikimedia.org/wiki/File:Porsche_GT3_engine_without_cover_(6293636286).jpg
  Clearly readable:
  - Large **polished crank pulley / damper** low-center, **ribbed serpentine belt**
    wrapping crank + alternator + multiple **idler/tensioner pulleys**.
  - **Ribbed black coolant hoses / metal unions** arcing across the top.
  - **Oil filter** + **AOS** canisters, **oil filler** cap top-right.
- `gt3rs_996_room.jpg` — 996 GT3 RS engine room (context). Source:
  https://commons.wikimedia.org/wiki/File:Porsche_996_GT3_RS_engine_room.jpg
- Spyder exterior shots (`spyder_engine_*.jpg`) — discarded (no engine visible).

Web text confirming the intake architecture (M96 plastic manifold = two plenum
chambers joined by tubes, one with a resonance butterfly; three runners per side):
- https://prestigeandperformancecar.com/porsche/porsche-m96-engine-guide/
- https://en.wikipedia.org/wiki/Porsche_flat-six_engine
- https://flat6motorsports.com/products/ipd-intake-plenum-991-1-carrera

### Overhaul geometry decisions (target = press cutaway / CAD layout)

| Assembly | Reference basis |
|----------|-----------------|
| Twin curved intake **bridge**: central throttle/distribution box + 2 big curved tubes to each bank, ring clamps, end-cap "PORSCHE" plates | `gt3_996_bay.jpg` central box + twin elbows |
| **Crank pulley / vibration damper**: layered hub, bolt-hole ring, black damper ring, belt groove | `gt3_nocover_*.jpg` polished crank pulley |
| **Serpentine belt** loop around crank + alternator + tensioners | `gt3_nocover_*.jpg` belt run |
| **Alternator**, idler/tensioner pulleys, **water pump** | `gt3_nocover_*.jpg` front accessories |
| **Ribbed coolant unions / hoses** crossing the top | `gt3_996_bay.jpg`, `gt3_nocover_*.jpg` |
| **Oil filter canister**, **oil filler + cap**, AOS | `gt3_996_bay.jpg` (filter + filler), `gt3rs_bay_crop.jpg` |
| **Bellhousing / transaxle taper** with casting ribs (mates rear of engine) | flat-six packaging; tapered ribbed alloy bell |
| **Partial cutaway** on one bank exposing bores + piston tops | for the "cutaway" press-render feel |

## Geometry decisions (which reference informed what)

| Part | Reference basis |
|------|-----------------|
| Wide low plenum w/ sculpted top ridge + "PORSCHE" badge plate | `gt3rs_bay_crop.jpg` plastic cover shape & script |
| Round resonance-flap housing on top-center of plenum | round black chamber in `gt3rs_bay_crop.jpg` |
| 6 curved intake runners (3 per bank) sweeping down to heads | OEM 981 plenum feeds both banks (flat6 / IPD) |
| Throttle body at rear corner | intake tubing entry in bay photo |
| Two banks x 3 cylinders, each w/ head casting + cam cover | confirmed 3-per-bank (Pelican/Design911) |
| 6 coil packs + spark-plug stubs (one per cylinder) | confirmed 6 coils (Pelican catalog) |
| Alternator: ribbed-end cylinder + pulley + serpentine belt at front | alternator in `gt3rs_bay_crop.jpg` |
| Oil filler neck + yellow cap | round filler cap in bay photo (yellow per Porsche convention) |
| Oil filter canister, dipstick tube, motor-mount lugs | standard MA1 service items / packaging |

Style kept in the clean technical-illustration register: low-poly, per-system palette
(`block`/`cover`/`intake`/`runner`/`steel`/`red`), every part a separate named node.
Engine reads as a compact cubic flat-six, not a tall inline block.
