// Bundler-safe article store. The human-readable source lives under
// ./articles/*.md; this file mirrors that content as strings so getArticles()
// works in any Next.js bundle without filesystem reads. Keep the two in sync.
import type { KnowledgeArticle } from './types';

export const ARTICLES: KnowledgeArticle[] = [
  {
    id: 'model-variant-overview',
    title: 'Porsche 981: Model & Variant Overview',
    tags: ['overview', 'variants', 'boxster', 'cayman', 'gts', 'gt4', 'spyder', 'history'],
    body: `# Porsche 981: Model & Variant Overview

The 981 is the third-generation Boxster and second-generation Cayman, built roughly 2012–2016. The Boxster (981) was announced at the March 2012 Geneva Motor Show and went on sale as a 2013 model year car; the Cayman (981c) followed for model year 2014. The generation was replaced by the turbocharged 718 (982) line, making the 981 the last Boxster/Cayman with a naturally aspirated flat-six across the whole range.

Versus the previous 987, the 981 chassis is around 40% more torsionally rigid, with a 60 mm longer wheelbase and wider tracks. It was the first Boxster/Cayman with electric power steering and an electronic parking brake.

## Variants and engines

- **Boxster / Cayman (base):** 2.7 L flat-six (MA1.22). Boxster ~265 PS, Cayman ~275 PS. 0–100 km/h around 5.6–5.8 s.
- **Boxster S / Cayman S:** 3.4 L (MA1.23). Boxster S ~315 PS, Cayman S ~325 PS.
- **Boxster GTS / Cayman GTS (2014+):** 3.4 L tuned higher — Boxster GTS ~330 PS, Cayman GTS ~340 PS — plus revised styling.
- **Boxster Spyder (2015):** 3.8 L, ~375 PS, lightweight, 6-speed manual only.
- **Cayman GT4 (2015):** 3.8 L derived from the 991 Carrera S engine, ~385 PS, 6-speed manual only, with 991 GT3-derived brakes and suspension.

Transmissions were a 6-speed manual or 7-speed PDK dual-clutch, except the GT4 and Boxster Spyder, which are manual-only.

Sources:
- https://en.wikipedia.org/wiki/Porsche_Boxster_and_Cayman_(981)
- https://www.stuttcars.com/porsche-cayman-gt4-2015-2016/
- https://www.auto-data.net/en/porsche-cayman-981c-gt4-3.8-385hp-21388`,
  },
  {
    id: 'engine-ma1-family',
    title: 'The MA1 (9A1) Flat-Six',
    tags: ['engine', 'ma1', '9a1', 'dfi', 'no-ims', 'variocam', 'specs'],
    body: `# The MA1 (9A1) Flat-Six

The 981 is powered by Porsche's DFI 9A1 / MA1 engine family, a water-cooled, naturally aspirated DOHC 24-valve flat-six introduced in 2009 to replace the older M96/M97. It is an all-aluminium design with direct fuel injection (DFI) and all-new cylinder heads and ports.

## No IMS bearing

The single most important reliability point: **the MA1 has no intermediate shaft (IMS), and therefore no IMS bearing.** The camshafts are chain-driven directly off the crankshaft, with the timing chains located at the front of the engine. The IMS bearing failures that haunted the M96/M97 engines in the 986 and 987.1 simply do not exist on the 981. The forged rotating assembly also resolved the older engine's connecting-rod-bolt concerns.

## Key features

- **VarioCam Plus:** combines intake-camshaft phasing with two-stage intake valve-lift switching.
- **Integrated dry-sump lubrication:** an integral dry sump with multiple scavenge pumps, rather than a true external-tank dry sump.
- **Direct fuel injection** with high compression (reported around 12.0–12.5:1).

## Variant engine codes

- 2.7 L (2,706 cc) = **MA1.22**
- 3.4 L (3,436 cc) = **MA1.23**
- 3.8 L (GT4/Spyder) = 9A1 family, derived from the 991 Carrera S engine (exact suffix unconfirmed — treat as MA1.01-derived pending a primary-source check)

Note: the 3.4 L is **MA1.23**, not MA1.22 — a common point of confusion. Exact bore/stroke figures for the 2.7 and 3.4 were not confirmed from a primary Porsche document in research and should be verified against the official spec sheet.

Sources:
- https://www.fcpeuro.com/blog/the-definitive-guide-to-porsche-997-engines
- https://www.718forum.com/threads/9a1-engine-tech.16228/
- https://en.wikipedia.org/wiki/List_of_Porsche_engines`,
  },
  {
    id: 'pdk-vs-manual',
    title: 'PDK vs Manual',
    tags: ['pdk', 'manual', 'transmission', 'dual-clutch', 'sport-chrono', 'launch-control'],
    body: `# PDK vs Manual

The 981 was offered with two transmissions: a 6-speed manual and the 7-speed PDK dual-clutch automatic. The GT4 and Boxster Spyder are manual-only.

## How PDK works

PDK stands for *Porsche Doppelkupplung* (double clutch). It is effectively two gearboxes in one housing: one clutch handles the odd gears (1/3/5/7) and the other handles the even gears (2/4/6). While one gear is driving, the next gear is already pre-selected on the other clutch, so a shift is just one clutch opening as the other closes — shift times are under 100 ms with near-seamless power delivery. The clutches are **wet (oil-bath)** type, which dissipates heat better and is more durable than the dry-clutch DCTs used by many other makers.

Crucially, the PDK has two separate fluid circuits: a **gear-oil** circuit (75W-90) and a **clutch/control fluid** circuit (Pentosin FFL-3). Retailers often mislabel the clutch fluid as "PDK transmission fluid," which causes confusion at service time.

## How the manual differs

The manual is a conventional 6-speed with a single dry clutch. It is lighter and, for many enthusiasts, more engaging — and it is the only choice on the halo GT4 and Spyder.

## Launch control and Sport Chrono

With the optional **Sport Chrono** package, PDK cars gain launch control, which holds an optimal launch rpm with controlled clutch slip for the quickest possible standing start. A PDK car with Sport Chrono is typically a few tenths quicker to 100 km/h than the equivalent manual.

## Choosing

- **PDK:** faster shifts, quicker acceleration, easier in traffic, the quickest configuration.
- **Manual:** lighter, more involving, the purist/enthusiast choice and the only option on GT4/Spyder.

Sources:
- https://www.porsche.com/stories/innovation/what-is-pdk/
- https://livermore.porsche.com/en/blog/how-porsche-launch-control-works-and-when-to-use-it
- https://rennlist.com/forums/981-forum/1179646-981-pdk-service-do-it-yourself.html`,
  },
  {
    id: 'fluids-capacities-cheatsheet',
    title: 'Fluids & Capacities Cheat-Sheet',
    tags: ['fluids', 'capacities', 'oil', 'coolant', 'brake-fluid', 'reference'],
    body: `# Fluids & Capacities Cheat-Sheet

A quick reference for the 981. Always confirm against the owner's manual and the car's own labels; some figures below are aggregator-sourced and flagged in the spec data.

## Engine oil

- **Spec:** Porsche A40 approval (HTHS ≥ 3.5). Factory fill is Mobil 1 0W-40; 5W-40 and 5W-50 are also A40-approved.
- **Capacity:** ~7.5 L (~7.9 US qt) with filter change, for 2.7, 3.4, and 3.8.

## Coolant

- **Type:** Porsche G40 — a pink/violet Si-OAT coolant (equivalent to VW G12++ / TL774-J, the "pink/002" family). Zerex G40 is an OEM-equivalent.
- **Mix:** 50/50 concentrate with distilled water.
- **Total system capacity:** ~23 L (2.7/3.4); ~25 L (3.8) — both aggregator figures, verify.

## Brake fluid

- **Spec:** DOT 4 Low Viscosity (Super DOT 4). Change every 2 years.

## Transmission

- **PDK gear oil:** SAE 75W-90 (~2.95 L drain & fill).
- **PDK clutch/control fluid:** Pentosin FFL-3 (Porsche P/N 00004330513) — requires PIWIS fill mode.
- **Manual gearbox:** SAE 75W-90, API GL-5 (~2.8 L refill).

## Power steering

- **None.** The 981 uses electromechanical (electric) power steering — there is no pump and no fluid to service.

## A/C

- **Refrigerant:** R134a, ~850 g charge. Compressor oil PAG ND8 / ISO 46.

## Fuel

- **Tank:** 54 L standard, or 64 L with the (very common) no-cost Extended Range option.

Sources:
- https://www.mobil.com/en/lubricants/for-personal-vehicles/our-products/porsche
- https://rennlist.com/forums/981-forum/1327909-coolant-type.html
- https://www.pelicanparts.com/More_Info/00004330513.htm
- https://database26.com/porsche-refrigerant-capacity-chart/`,
  },
  {
    id: 'common-problems-guide',
    title: 'Common Problems Guide',
    tags: ['issues', 'reliability', 'aos', 'water-pump', 'pdk', 'recalls', 'no-ims'],
    body: `# Common Problems Guide

The 981 is among the more reliable modern Porsches, but a few items are worth knowing. The biggest reassurance up front: the 981's DFI 9A1/MA1 engine has **no IMS bearing** — the failure mode that worries buyers of older 986/987.1 cars does not apply here.

## Engine

- **Air-oil separator (AOS):** the most common engine niggle. Symptoms are white startup smoke, rough idle, and high oil consumption. Replace the AOS (~$400–$900).
- **Bore scoring:** a watercooled-flat-six concern, but **rare on the 981**. Confirm with a borescope or oil analysis rather than by ear, since it hides behind the normal DFI injector tick.
- **High oil consumption:** some is normal; severe cases usually trace to the AOS/PCV.
- **Rear main seal leaks:** weeping at the bellhousing; on manuals it can foul the clutch.
- **Ignition coils / spark plugs:** early coils can crack and cause misfires; replace plugs on schedule to avoid seizing.

## Cooling

- **Water pump** bearing wear, **coolant expansion tank** cracking, and **front coolant pipe** seal leaks are all age/heat-driven plastic-and-rubber wear items.

## Transmission

- **PDK Mechatronic:** the gearset rarely fails; the front Mechatronic clutch/control unit and its position sensors are the concern. Regular fluid service is the best prevention.

## Body / electrical / suspension

- **Convertible top microswitches** (Boxster): top stalls mid-cycle; test the control unit first (cheap) before the buried switches (very labor-intensive).
- **Front control-arm "coffin arm" bushings:** clunk over bumps; a common wear item.
- **PCM/infotainment** board failures; **exhaust-flap actuator** seizing.

## Recalls

Verify by VIN at recall.porsche.com. Known campaigns include a **rear-axle carrier side-section** recall (2013–2015, NHTSA 21V-679) and an **airbag control module** campaign.

Sources:
- https://www.pcarwise.com/local-help/porsche-common-problems/porsche-boxster-cayman-common-problems/
- https://www.pistonheads.com/gassing/topic.asp?h=0&f=231&t=1964606
- https://static.nhtsa.gov/odi/rcl/2021/RCMN-21V679-0595.pdf`,
  },
  {
    id: 'brakes-and-pccb',
    title: 'Brakes & PCCB',
    tags: ['brakes', 'pccb', 'ceramic', 'rotors', 'calipers', 'specs'],
    body: `# Brakes & PCCB

The 981 uses cross-drilled, internally vented steel discs as standard, with carbon-ceramic brakes available as an option.

## Steel brakes by variant

- **Base:** front discs around 315 mm × 28 mm.
- **S models:** larger 330 mm front discs with 4-piston aluminium monobloc fixed calipers up front.
- **GTS:** S-derived brakes; 20-inch wheels standard.
- **Boxster Spyder / Cayman GT4:** 911 Carrera S / 991 GT3-derived brakes — 6-piston front calipers with ~340 mm discs and 4-piston rears. These are the strongest factory steel setup on the 981.

The S/GTS front disc minimum (wear) thickness is **26 mm** (new 28 mm) and the rear is **18 mm** (new 20 mm); the figure is stamped on the disc. Replace pads when friction material reaches roughly 2 mm.

## PCCB (Porsche Ceramic Composite Brakes)

PCCB is the optional carbon-ceramic system, identified by its **yellow calipers**. The discs are silicon-carbide composite and far lighter than steel, cutting unsprung and rotating mass and offering excellent fade resistance and long life under normal road use.

The caution: PCCB is very expensive to replace, can chip, and track use shortens its life dramatically — so a used 981 with worn PCCB can carry a large hidden replacement bill. For mostly-road cars, the steel brakes are excellent and far cheaper to live with.

Exact PCCB disc dimensions and caliper piston counts vary by variant and should be confirmed against the official spec sheet before quoting.

Sources:
- https://en.wikipedia.org/wiki/Porsche_Boxster_and_Cayman_(981)
- https://rennlist.com/forums/981-forum/1337788-min-rotor-thickness-replacement.html
- https://www.stuttcars.com/porsche-cayman-gt4-2015-2016/`,
  },
  {
    id: 'suspension-and-pasm',
    title: 'Suspension & PASM',
    tags: ['suspension', 'pasm', 'ptv', 'dampers', 'lsd', 'handling', 'wheels'],
    body: `# Suspension & PASM

The 981 uses a MacPherson strut suspension at both the front and rear, with lightweight aluminium components and a mid-engine layout that gives it famously balanced handling.

## PASM (Porsche Active Suspension Management)

PASM is the optional electronically controlled adaptive damping system. It continuously varies damper firmness based on driving style and road conditions, and selecting PASM also **lowers the ride height by about 10 mm**. A more aggressive Sport suspension / PASM Sport option lowers the car further (around 20 mm) for sharper handling at the expense of ride comfort. Exact lowering figures vary by market and option code, so verify against the spec sheet.

## PTV (Porsche Torque Vectoring)

PTV is an optional system that pairs a **mechanical limited-slip differential** with brake-based torque vectoring. It brakes the inside rear wheel during hard cornering to tighten the line and improve traction on corner exit. On the 981 it could be ordered together with or independently of PASM. The factory LSD is relatively mild (low lock percentage), which is why many track-focused owners upgrade it.

## Wheels and stance

Standard wheel sizes step up by variant: 18-inch on the base car, 19-inch typically on the S, and 20-inch standard on the GTS, Spyder, and as an upgrade elsewhere. The GT4 runs wider, more aggressive fitment (245 front / 295 rear on 20-inch wheels). The staggered setup means front-to-rear tyre rotation is generally not possible.

## Common wear

The most common suspension complaint is worn front control-arm and thrust-arm bushings ("coffin arms"), which cause a clunk over bumps, plus aging upper strut mounts. PASM-equipped cars can also throw faults from ride-height sensors or leaking adaptive struts.

Sources:
- https://en.wikipedia.org/wiki/Porsche_Boxster_and_Cayman_(981)
- https://rennlist.com/forums/981-forum/
- https://tarett.com/collections/control-arms-986`,
  },
  {
    id: 'buyers-inspection-checklist',
    title: "Buyer's Inspection Checklist",
    tags: ['buying', 'ppi', 'inspection', 'used', 'checklist'],
    body: `# Buyer's Inspection Checklist

A focused pre-purchase checklist for a used 981 Boxster or Cayman. A professional pre-purchase inspection (PPI) at a Porsche specialist is strongly recommended; this list is what to watch for.

## Engine

- **No IMS worry:** the 981's MA1 engine has no IMS bearing, so ignore IMS scaremongering — it does not apply.
- Cold-start the car yourself. Listen for an unusual rattle/tick (possible bore scoring — rare, but expensive). Check for white startup smoke (AOS).
- Ask for an oil consumption history; check the dipstick/electronic level and oil condition.
- Look for oil weeping at the bellhousing (rear main seal), especially on manuals.

## Cooling

- Check the coolant level and look around the expansion tank and front coolant pipe for crusty residue or weeping (cracked tank / pipe seals).

## Transmission

- **PDK:** confirm the fluid has been serviced; feel for clean, crisp shifts with no flare or "Gearbox fault" warnings.
- **Manual:** check clutch bite point and that it is not slipping (also flags possible RMS contamination).

## Brakes & suspension

- Measure pad and disc wear; if it has **PCCB (yellow calipers)**, budget heavily for replacement and check for chipping — worn PCCB is a major hidden cost.
- Drive over bumps listening for front-end clunk (control-arm bushings) and check for PASM faults.

## Body & electrical

- **Boxster:** cycle the convertible top fully several times; any pause or fault is a costly microswitch job. Check the roof drains are clear (under-seat module water damage).
- Test the PCM/infotainment, all electrics, and the A/C output.

## Paperwork

- Verify the service history (especially oil, brake fluid, and any PDK service).
- Check all outstanding recalls by VIN at recall.porsche.com (rear-axle carrier, airbag module).

Sources:
- https://www.pcarwise.com/local-help/porsche-common-problems/porsche-boxster-cayman-common-problems/
- https://rennlist.com/forums/981-forum/
- https://recall.porsche.com/`,
  },
  {
    id: 'diy-oil-change',
    title: 'DIY Oil Change',
    tags: ['diy', 'oil', 'maintenance', 'service', 'torque'],
    body: `# DIY Oil Change

The 981 oil change is a beginner-friendly job. The engine takes about **7.5 L** of Porsche A40-approved oil (factory fill 0W-40) with a new filter element. Always confirm specs against your owner's manual.

## What you need

- ~8 L of A40-approved oil (e.g. Mobil 1 0W-40)
- Oil filter element kit (includes the cap O-ring)
- New aluminium drain-plug crush ring
- T50 Torx for the drain plug, the correct oil-filter cap socket, a torque wrench
- ~10 L drain pan, jack and stands or ramps

## Procedure

1. Warm the engine briefly so the oil flows, then shut off. Raise and secure the rear of the car safely.
2. Remove the rear underbody panel to access the drain plug and filter.
3. Position the pan and remove the **T50 drain plug**. Let it drain fully.
4. Remove the oil filter cap, swap in the new element, fit the new cap O-ring lightly oiled.
5. Refit the filter cap to **25 Nm** and the drain plug — with a **new crush ring** — to **50 Nm**.
6. Refit the underbody panel, lower the car, and add oil. Start at ~7 L, then top up to the correct level using the electronic gauge or dipstick. Do not overfill.
7. Run the engine, check for leaks, recheck the level, and reset the maintenance reminder.

## Notes

- Factory interval is 1 year / 10,000 mi; many owners do 5,000–7,500 mi.
- Dispose of used oil and the filter responsibly at a recycling center.

Torque values are from owner-DIY references; verify against the workshop manual.

Sources:
- https://www.pedrosgarage.com/site-3/change-oil-and-oil-filter.html
- https://www.mobil.com/en/lubricants/for-personal-vehicles/our-products/porsche`,
  },
  {
    id: 'diy-brake-pads',
    title: 'DIY Brake Pads',
    tags: ['diy', 'brakes', 'pads', 'maintenance', 'torque'],
    body: `# DIY Brake Pads

Replacing pads on the 981's fixed monobloc calipers is a moderate DIY job. **Do not attempt this on PCCB (yellow caliper) cars without the correct ceramic-specific pads and procedure.**

## What you need

- Correct front/rear pad set for your variant
- New caliper mounting bolts if you remove the caliper (they are single-use stretch bolts)
- Brake cleaner, a caliper piston tool, anti-squeal/lubricant for the pad backs and pins
- Torque wrench, jack and stands, the wheel-bolt socket

## Procedure

1. Loosen the wheel bolts, raise and secure the car, remove the wheel.
2. On the fixed caliper, remove the pad retaining pins/clips and slide the old pads out (you usually do **not** need to remove the caliper itself for a pad-only job).
3. Inspect the disc: minimum thickness is stamped on it (S/GTS front ~26 mm, rear ~18 mm). Replace discs if at or below minimum.
4. Push the pistons back carefully (watch the fluid reservoir level so it does not overflow).
5. Fit the new pads with anti-squeal on the backing plates; reinstall pins/clips.
6. If you removed the caliper, torque the mounting bolts to **85 Nm with new bolts**. Brake line unions are **16 Nm**.
7. Refit the wheel and torque the bolts to **160 Nm**.
8. Before driving, **pump the brake pedal** until firm to take up the piston clearance. Bed the pads in per the manufacturer's instructions.

## Notes

- Replace pads at ~2 mm friction material.
- Consider a brake-fluid flush at the same time if it is due (every 2 years).

Torque values are from 981 owner references; verify against the workshop manual.

Sources:
- https://rennlist.com/forums/981-forum/1200944-torque-values-bolts-and-nuts-981-cs.html
- https://www.pca.org/tech/what-is-the-torque-on-the-brake-caliper-bolts-1594611638`,
  },
  {
    id: 'cooling-system',
    title: 'Cooling System',
    tags: ['cooling', 'coolant', 'water-pump', 'radiator', 'expansion-tank', 'g40'],
    body: `# Cooling System

The 981 mid-engine layout places the radiators at the **front** of the car, fed by ducting from the front bumper, with coolant pumped the length of the car to and from the rear-mounted flat-six. This long plumbing run means the cooling system has several known wear points, almost all of them plastic-and-rubber components that age with heat cycling.

## Coolant

Use **Porsche G40** coolant — a pink/violet Si-OAT type (equivalent to VW G12++ / TL774-J, the "pink/002" family). Mix concentrate 50/50 with distilled water, or use the prediluted version. Do not mix it with green/blue silicate or generic OAT coolants. Total system capacity is roughly 23 L on the 2.7/3.4. Porsche lists the coolant as lifetime/no fixed interval, but many owners refresh it around the 10–12 year mark.

## Common failure points

- **Water pump:** the shaft bearing wears, causing a knock, pulley wobble, and eventually a coolant leak. Often replaced together with the thermostat.
- **Coolant expansion tank:** the plastic reservoir cracks with age and can split suddenly, dumping coolant and risking overheating.
- **Front coolant pipe seals:** the rubber seals between the plastic front coolant pipe and the engine degrade and weep. Porsche revised the part several times.
- **Radiators:** front-mounted, so they collect road debris and leaves; clean them out and watch for stone damage.

## Watch points

Keep an eye on the coolant level and look for crusty residue or a sweet smell, which signal a slow leak before it becomes a roadside failure. Because the radiators sit low at the front, debris build-up reduces cooling and can trap moisture against the cores.

Sources:
- https://rennlist.com/forums/981-forum/1327909-coolant-type.html
- https://www.pcarwise.com/local-help/porsche-common-problems/porsche-boxster-cayman-common-problems/
- https://www.pelicanparts.com/More_Info/00004330575.htm`,
  },
  {
    id: 'convertible-top',
    title: 'Convertible Top (Boxster)',
    tags: ['convertible', 'top', 'roof', 'boxster', 'hydraulics', 'microswitch'],
    body: `# Convertible Top (Boxster)

The 981 Boxster (and the Spyder) uses a power-operated fabric convertible top that can be raised or lowered in about 9 seconds, even on the move at low speed. It is an electro-hydraulic system: an electric motor drives a hydraulic pump that moves the cylinders raising and lowering the top, with a series of microswitches reporting the position of the top through its cycle.

## How it operates

The top folds in a "Z" pattern and stows under a body-color lid. Position microswitches tell the control unit where the top is at each stage, so the control unit can sequence the latches, lid, and cylinders correctly. If any one of those position signals is implausible, the control unit halts the cycle to protect the mechanism.

## Common faults

The most common failure is a **microswitch** going bad, which causes the top to stop part-way through its cycle and store a fault — commonly code **54398** (top position implausible) or a top-motor temperature-limiter code if it has been cycled repeatedly while faulting.

The important diagnostic order: **test the rear-compartment top control unit first.** Swapping the control unit is a roughly 5-minute job, whereas reaching the buried microswitches requires removing the entire top — a 6+ hour labor job that often runs $1,500–$2,000. Confirm the cheap part before committing to the expensive one.

## Maintenance

Keep the **roof drains clear** — blocked drains let water pool and can damage under-seat control modules, causing unrelated electrical gremlins. Lubricate the top mechanism periodically and operate the top fully and regularly so the hydraulics and seals stay healthy.

Sources:
- https://rennlist.com/forums/981-forum/1244699-convertible-top-pausing-issues.html
- https://www.planet-9.com/threads/981-boxster-convertible-top-not-moving.247728/`,
  },
];
