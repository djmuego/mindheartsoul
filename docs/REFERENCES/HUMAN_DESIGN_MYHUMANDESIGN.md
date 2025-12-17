# Human Design — Reference Analysis: myhumandesign.com

**Date:** 2025-12-17  
**Reference Site:** https://www.myhumandesign.com/  
**Purpose:** UX/IA/Taxonomy benchmark for MindHeartSoul Human Design module (P2)  
**Status:** 📋 DEFERRED TO P2 (Reference locked, implementation pending)

---

## 🎯 **Reference Summary**

**myhumandesign.com** serves as our primary UX reference for Human Design module architecture. We take their:
- Information Architecture (IA)
- User flow patterns
- Content hierarchy
- Empty states approach
- CTA patterns

**⚠️ Important:** This is a UX/taxonomy reference only. We do NOT copy:
- Text content (will write our own, localize to 5 languages)
- Graphics/images (will create our own Bodygraph renderer)
- Branding/design system (we use our own Tailwind theme)

---

## 🗺️ **IA (Information Architecture) Analysis**

### **1. Entry Flow: "Get Your Chart"**

**Reference Pattern:**
```
Landing → Get Your Chart (Form) → Chart Generated → Start with Type
```

**Form Fields:**
- Name
- Email
- Birth Date
- Birth Time
- Birth Location (with UX hint: "City needed for timezone")

**Key UX Insight:**
- Location is for timezone calculation, not GPS tracking
- Clear explanation reduces friction

**Our Implementation (P2):**
```typescript
// src/components/screens/HumanDesignScreen.tsx

1. Check if user has birthProfile in storage
2. IF YES:
   - Auto-calculate chart data (or show placeholder if engine not ready)
   - Show Type card immediately
3. IF NO:
   - Show "Get Your Chart" wizard
   - Collect: name, birthDate, birthTime, birthLocation
   - Save to birthProfile
   - Redirect to chart view
```

---

### **2. Content Hierarchy: "Start with Your Energy Type"**

**Reference Pattern:**
```
Type (Primary) → Essentials (Type/Authority/Profile) → Deep Dive (Centers/Channels/Gates)
```

**Type-First Approach:**
- 5 Energy Types: Generator, Manifesting Generator, Projector, Manifestor, Reflector
- Each type has: Strategy, Signature (when aligned), Not-self theme (when misaligned)
- Type is the #1 entry point for beginners

**Our Implementation (P2):**
```typescript
// src/features/human-design/sections/TypeCard.tsx

<TypeCard type={chart.type}>
  <TypeBadge /> {/* Generator, Projector, etc. */}
  <StrategyText /> {/* "Wait to respond" */}
  <SignatureText /> {/* "Satisfaction" */}
  <NotSelfText /> {/* "Frustration" */}
  <CTA>Learn More About {type}</CTA>
</TypeCard>
```

---

### **3. Essentials Taxonomy (Core Concepts)**

**Reference Structure:**
```
Essentials:
  ├── Energy Type (Primary)
  ├── Authority (Decision-making)
  └── Profile (Life theme)
```

**Secondary Concepts:**
```
Deep Dive:
  ├── Centers (9 centers, defined/undefined)
  ├── Channels (64 gates, 36 channels)
  ├── Gates (specific activations)
  └── Variables (advanced: PHS, Environment, etc.)
```

**Our Navigation (P2):**
```typescript
// src/features/human-design/navigation.ts

const HD_TABS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'type', label: 'Energy Type', icon: Zap },
  { id: 'authority', label: 'Authority', icon: Shield },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'centers', label: 'Centers', icon: Circle },
  { id: 'chart', label: 'Bodygraph', icon: Network }, // Visual chart
] as const;
```

---

## 📐 **Component Breakdown (Derived from Reference)**

### **1. Get Your Chart Wizard**

**Required Components:**
- `BirthDataForm.tsx` — Input form (date, time, location)
- `LocationAutocomplete.tsx` — City search with timezone preview
- `TimezoneWarning.tsx` — "Why we need your location" explainer
- `ChartCalculating.tsx` — Loading state while calculating

**Empty State:**
- Icon: Sparkles
- Headline: "Discover Your Human Design"
- Body: "Enter your birth details to generate your unique Bodygraph chart"
- CTA: "Get Started"

---

### **2. Type Card (Primary)**

**Required Components:**
- `TypeCard.tsx` — Main type display
- `StrategyBadge.tsx` — Strategy text with icon
- `SignatureBadge.tsx` — Signature theme
- `NotSelfBadge.tsx` — Not-self theme
- `TypeDescription.tsx` — Detailed explanation

**Empty State:**
- If birth data missing: "Complete your profile to see your Type"
- CTA: "Add Birth Data"

---

### **3. Authority Section**

**Required Components:**
- `AuthorityCard.tsx` — Authority type (Emotional, Sacral, Splenic, etc.)
- `DecisionStrategy.tsx` — How to make decisions
- `AuthorityDescription.tsx` — Detailed explanation

**Empty State:**
- Same as Type: needs birth data

---

### **4. Profile Section**

**Required Components:**
- `ProfileCard.tsx` — Profile number (e.g., 1/3, 2/4, 3/5)
- `ProfileLines.tsx` — Conscious/Unconscious lines
- `ProfileDescription.tsx` — Life theme explanation

**Empty State:**
- Same as Type: needs birth data

---

### **5. Centers Section**

**Required Components:**
- `CentersGrid.tsx` — 9 centers visual grid
- `CenterCard.tsx` — Individual center (defined/undefined)
- `CenterDescription.tsx` — Center function explanation

**Empty State:**
- "Centers show which areas you have consistent energy"
- CTA: "Learn About Centers"

---

### **6. Bodygraph Chart (Visual)**

**Required Components:**
- `BodygraphCanvas.tsx` — SVG or Canvas renderer
- `BodygraphLegend.tsx` — Color coding explanation
- `BodygraphZoom.tsx` — Zoom/pan controls (optional)

**Empty State:**
- Placeholder Bodygraph (generic, no personal data)
- Text: "Complete your profile to see your personal chart"

**⚠️ Implementation Note:**
- Bodygraph rendering is complex (SVG paths, gate positions, channel connections)
- Deferred to P2 with dedicated sprint
- Consider open-source libraries: `hdkit` (MIT license), `bodygraph-chart` (if exists)

---

## 🎨 **UX Patterns (Borrowed from Reference)**

### **1. Progressive Disclosure**

**Pattern:**
- Start simple (Type card)
- Expand to Essentials (Type → Authority → Profile)
- Deep dive on demand (Centers → Channels → Gates)

**Our Implementation:**
- Home screen: Type badge only
- HD screen: Tabs for progressive disclosure
- Avoid overwhelming new users

---

### **2. Empty State Strategy**

**Pattern:**
- Icon + Headline + Body + CTA
- Clear next action ("Add Birth Data" vs "Learn More")

**Our Implementation:**
- `<EmptyState icon={Sparkles} title="..." body="..." cta="..." />`
- Consistent across all HD sections

---

### **3. Education-First Approach**

**Pattern:**
- "What is Human Design?" explainer on landing
- "Why does this matter?" for each concept
- Links to learning resources

**Our Implementation:**
- Add "Learn More" modals/tooltips for key concepts
- Link to internal courses (if we build HD course)
- External resources (books, videos) in footer

---

## 🔧 **Technical Architecture (P2 Roadmap)**

### **Phase 1: Data Model**

**Storage Schema:**
```typescript
interface HumanDesignChart {
  userId: string;
  birthDate: string; // ISO format
  birthTime: string; // HH:mm
  birthLocation: {
    city: string;
    country: string;
    timezone: string;
    lat: number;
    lng: number;
  };
  calculated: {
    type: 'Generator' | 'MG' | 'Projector' | 'Manifestor' | 'Reflector';
    strategy: string;
    authority: string;
    profile: string; // e.g., "1/3"
    signature: string;
    notSelf: string;
    centers: Center[]; // 9 centers, defined/undefined
    channels: Channel[]; // activated channels
    gates: Gate[]; // activated gates
    variables?: Variables; // advanced
  };
  calculatedAt: string; // ISO timestamp
}
```

---

### **Phase 2: Calculation Engine**

**Options:**

**Option A: Open-Source Library (Recommended)**
- **hdkit** (GitHub): MIT license, TypeScript-ready
- Pros: Free, well-maintained, community-backed
- Cons: May need ephemeris data (Swiss Ephemeris or similar)

**Option B: API Service**
- **Jovian Archive API** (if available): Official HD source
- Pros: Accurate, no local calculation
- Cons: Cost, rate limits, API key management

**Option C: Custom Engine**
- Build from scratch using ephemeris data
- Pros: Full control
- Cons: High complexity, months of work

**Recommendation:** Start with **hdkit** (MIT) + ephemeris bindings (check license carefully)

---

### **Phase 3: Bodygraph Renderer**

**Approach:**

**SVG-Based Renderer:**
```typescript
// src/features/human-design/bodygraph/BodygraphRenderer.tsx

<svg viewBox="0 0 400 600">
  {/* Centers (9 geometric shapes) */}
  <CenterNode center="head" defined={chart.centers.head.defined} />
  <CenterNode center="ajna" defined={chart.centers.ajna.defined} />
  {/* ... */}
  
  {/* Channels (connecting lines) */}
  {chart.channels.map(channel => (
    <ChannelPath key={channel.id} channel={channel} />
  ))}
  
  {/* Gates (numbers on centers) */}
  {chart.gates.map(gate => (
    <GateLabel key={gate.number} gate={gate} />
  ))}
</svg>
```

**Challenges:**
- Precise gate positions (64 gates across 9 centers)
- Channel paths (36 possible channels)
- Color coding (defined/undefined, conscious/unconscious)
- Responsive scaling

**Recommendation:** Use existing SVG template (from hdkit or open-source Bodygraph) and customize

---

## 🌍 **i18n Strategy (5 Locales)**

### **Key Terms to Translate:**

**Core Concepts:**
- Energy Type, Strategy, Authority, Profile, Centers, Channels, Gates
- Signature, Not-self theme

**Type Names:**
- Generator, Manifesting Generator, Projector, Manifestor, Reflector

**Authority Types:**
- Emotional, Sacral, Splenic, Ego, Self-Projected, Mental, Lunar (Reflector)

**Center Names:**
- Head, Ajna, Throat, G-Center, Heart (Ego), Solar Plexus, Sacral, Spleen, Root

**⚠️ Translation Note:**
- Some HD terms are intentionally kept in English (e.g., "Bodygraph", "Rave Mandala")
- Consult official HD translations for accuracy (especially Russian, German)

---

## 📋 **Empty State Reference (From Site Analysis)**

### **Scenario 1: No Birth Data**

**Icon:** Sparkles  
**Headline:** "Discover Your Human Design"  
**Body:** "Enter your birth details to reveal your unique energetic blueprint"  
**CTA:** "Get Your Chart"

---

### **Scenario 2: Birth Data Exists, Engine Not Ready**

**Icon:** Clock  
**Headline:** "Your Chart is Ready!"  
**Body:** "We're preparing your detailed Human Design analysis. Check back soon."  
**CTA:** "Explore Other Features"

---

### **Scenario 3: Chart Calculated, No Section Data**

**Icon:** Info  
**Headline:** "Learn About [Authority/Profile/Centers]"  
**Body:** "This section explains [concept]. Start with your Type to understand the basics."  
**CTA:** "Back to Overview"

---

## 🔐 **Licensing & Legal Considerations**

### **Human Design IP**

**Important:**
- "Human Design System" is trademarked by Jovian Archive
- Bodygraph is copyrighted
- We can build an educational tool, but cannot claim to be "official"

**Our Approach:**
- Use generic terms: "Your energetic blueprint", "Personality type analysis"
- Credit: "Based on the Human Design System by Ra Uru Hu"
- Link to official resources for deep learning

---

### **Ephemeris Data Licensing**

**Swiss Ephemeris:**
- Dual license: GPL or commercial
- If we use GPL version, our app must be GPL (not suitable for commercial product)
- **Recommendation:** Buy commercial license OR use alternative ephemeris

**Alternatives:**
- NASA JPL Ephemeris (public domain)
- Moshier Ephemeris (public domain, less accurate)

---

## 📚 **Resources & Tools**

### **Open-Source Libraries**

- **hdkit** (GitHub): https://github.com/hdkit/hdkit — TypeScript HD calculation
- **bodygraph-chart** (if exists): SVG Bodygraph renderer
- **sweph** (C library + bindings): Swiss Ephemeris (check license)

### **Learning Resources**

- **Jovian Archive:** Official HD source (books, courses)
- **myhumandesign.com:** Reference site (UX inspiration)
- **geneticmatrix.com:** Alternative HD site (comparison)

### **Calculation Validation**

**Test Cases:**
- Reference birth data: October 31, 1980, 14:30, New York
- Compare output with multiple HD calculators
- Verify Type, Authority, Profile match across sources

---

## ✅ **Implementation Checklist (P2 Sprint)**

### **Week 1: Data Model + Wizard**
- [ ] Define `HumanDesignChart` type in `src/types.ts`
- [ ] Create `BirthDataForm.tsx` with location autocomplete
- [ ] Save birth data to `birthProfile` (reuse existing Natal data)
- [ ] Add "Get Your Chart" wizard flow

### **Week 2: Calculation Engine**
- [ ] Evaluate `hdkit` library (MIT license check)
- [ ] Integrate ephemeris data (resolve licensing)
- [ ] Build calculation service: `src/services/humanDesignService.ts`
- [ ] Test calculations against reference data

### **Week 3: UI Components**
- [ ] Build `TypeCard.tsx` (primary display)
- [ ] Build `AuthorityCard.tsx` (decision strategy)
- [ ] Build `ProfileCard.tsx` (life theme)
- [ ] Build `CentersGrid.tsx` (9 centers visual)

### **Week 4: Bodygraph Renderer**
- [ ] Research SVG template (hdkit or custom)
- [ ] Build `BodygraphCanvas.tsx` (SVG-based)
- [ ] Add gate/channel overlays
- [ ] Add zoom/pan controls (optional)

### **Week 5: i18n + Testing**
- [ ] Translate all HD terms to 5 locales
- [ ] Add 20+ unit tests for calculation logic
- [ ] Smoke test: Full flow (birth data → chart → all sections)
- [ ] Documentation: `docs/HUMAN_DESIGN.md`

---

## 🚦 **Current Status (2025-12-17)**

**Human Design Module:**
- Status: 📋 **DEFERRED TO P2**
- Placeholder: ✅ Active (clean empty state)
- Reference: ✅ **LOCKED** (myhumandesign.com)
- Architecture: ✅ Spec ready (this document)
- Implementation: ⏭️ Pending (estimated: 5 weeks, 1 engineer)

**Dependencies:**
- P2 prioritization decision
- Ephemeris licensing resolution
- Budget for hdkit integration (if needed)

---

## 📞 **Questions for Product Lead**

1. **Timeline:** When should P2 HD sprint start? (Q1 2026? Q2 2026?)
2. **Budget:** Willing to pay for Swiss Ephemeris commercial license (~$500-1000)?
3. **Scope:** Full Bodygraph renderer or text-only analysis first?
4. **Legal:** Confirm trademark usage guidelines with legal team?

---

**Last Updated:** 2025-12-17  
**Author:** Claude AI Assistant (Anthropic)  
**Next Review:** When P2 HD sprint is prioritized

