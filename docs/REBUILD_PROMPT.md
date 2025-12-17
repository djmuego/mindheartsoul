# 🏗️ MindHeartSoul - Complete Rebuild Prompt

## 📋 Project Overview

**Goal**: Rebuild MindHeartSoul as a modular, working spiritual guidance platform with:
- Clean, independent modules (no cross-dependencies)
- English-first with i18n ready for localization
- Working Chat with AI Assistant (Gemini API)
- Placeholder pages for incomplete features
- Mentorship/Consultation focus

---

## 🎯 Core Requirements

### 1. Architecture Principles

**MODULAR DESIGN**:
- Each module is 100% independent
- No module breaks if another module is disabled
- Module registry pattern (already implemented)
- Easy to enable/disable modules

**CODE QUALITY**:
- TypeScript strict mode - no compilation errors
- All functions have proper types
- No unused imports or variables
- ESLint clean

**I18N STRATEGY**:
- English-first (complete all English text)
- i18n keys for all user-facing text
- Other locales can be added later (RU, DE, ES, PL)
- Use `t('namespace.key')` pattern

**PLACEHOLDER STRATEGY**:
- Incomplete features show placeholder screens
- Each placeholder has:
  - Clear title "Coming Soon"
  - Brief description of what will be here
  - CTA button (e.g., "Back to Home", "Find a Mentor")
  - Professional design (not broken UI)

---

## 🗂️ Module Structure

### Core Modules (Must Work)

#### 1. **Home Module** 
**Status**: ✅ Must Work  
**Path**: `/home`  
**Features**:
- Welcome section with user name
- Quick access cards to main features
- Upcoming sessions preview (if any bookings)
- AI Assistant quick chat preview
- "Explore" sections for Natal Chart, Mentorship

**Navigation**: Bottom nav icon (Home 🏠)

---

#### 2. **Mentors Module**
**Status**: ✅ Must Work (Mentorship Focus)  
**Paths**: 
- `/mentors` - List of mentors
- `/mentors/:id` - Mentor profile
- `/book/:mentorId` - Booking form
- `/book/confirm/:mentorId` - Booking confirmation
- `/booking/:id` - Booking details

**Features**:
- List view with mentor cards (name, title, price, avatar)
- Search/filter by specialty
- Mentor profile page:
  - Bio, languages, tags
  - Session types (1-on-1 consultation, group session, etc.)
  - **"Book Session" button** → booking flow
  - **"Open Chat" button** → direct message to mentor
- Booking flow:
  - Select session type
  - Pick date/time (calendar component)
  - Add note
  - Confirm & Pay (mock payment)
- Booking detail page:
  - Status: pending_payment, confirmed, cancelled
  - **"Open Chat" button** for confirmed bookings
  - **"Pay Now" button** for pending_payment

**Navigation**: Bottom nav icon (Mentors 👥)

---

#### 3. **Messages/Chat Module**
**Status**: ✅ Must Work (Core Feature)  
**Paths**:
- `/chat` - Conversations list
- `/chat/:id` - Chat thread

**Features**:
- **Conversation Types**:
  - User ↔ Mentor conversations
  - User ↔ AI Assistant conversation
- **Chat List**:
  - Shows all conversations
  - Last message preview
  - Unread indicator
- **Chat Thread**:
  - Real-time message send (localStorage)
  - Message persistence (localStorage)
  - Input field with send button
  - **AI Assistant Integration**:
    - Check if `VITE_GEMINI_API_KEY` exists
    - If user is Pro + API key exists → real AI responses
    - If user is not Pro → "Upgrade to Pro" upsell message
    - If no API key → "AI temporarily unavailable" message
    - **Basic chat always works** (no dependency on AI)
  - Auto-scroll to bottom
  - Message timestamps

**Navigation**: Bottom nav icon (Messages 💬)

**Technical**:
- Use `src/services/chatService.ts` for localStorage
- AI integration via Gemini API (see `src/services/aiService.ts` if exists, or create)
- No video calls (removed)

---

#### 4. **My Sessions Module**
**Status**: ✅ Must Work  
**Path**: `/sessions`  

**Features**:
- List of user's bookings
- Grouped by status:
  - Pending Payment (red badge)
  - Confirmed (green badge)
  - Past (gray)
- Each session card:
  - Mentor name & avatar
  - Session date/time
  - Status badge
  - **"Open Chat" button** (if confirmed)
  - **"Pay Now" button** (if pending_payment)

**Navigation**: Bottom nav icon (Sessions 📅)

---

#### 5. **Profile Module**
**Status**: ✅ Must Work  
**Path**: `/profile`  

**Features**:
- User avatar & name
- Birth data summary (if entered)
- Quick stats:
  - Total sessions
  - Favorite mentors
- Links:
  - Settings
  - Notifications
  - Pro subscription status
  - Logout

**Navigation**: Bottom nav icon (Profile 👤)

---

#### 6. **Settings Module**
**Status**: ✅ Must Work  
**Path**: `/settings`  

**Features**:
- Account settings (name, email, password)
- Birth data entry (date, time, city) - for Natal Chart
- Language selection (EN only for now, show others grayed out)
- Theme toggle (Light/Dark)
- Notifications preferences
- Privacy & Terms links

**Navigation**: Via Profile screen

---

### Spiritual Modules (Natal Chart Hub)

#### 7. **Natal Chart Hub Module**
**Status**: ✅ Must Work (Hub Screen)  
**Path**: `/natal`  

**Features**:
- **NO CHART WHEEL** (removed for simplicity)
- 4 Main Sections (2x2 grid):
  1. **Astrology** (Sun, Moon, Rising signs)
  2. **Numerology** (Life Path, Expression numbers)
  3. **Human Design** (Type, Strategy, Authority)
  4. **Meditation** (Guided practices)
- Each section card:
  - Icon
  - Title
  - Brief description (1-2 lines)
  - "Explore" button
- If no birth data → show CTA "Add Birth Data in Settings"

**Navigation**: Via Home screen (no bottom nav for this)

---

#### 8. **Astrology Module**
**Status**: 🟡 Placeholder (but shows real data if available)  
**Path**: `/astrology`  

**Features**:
- If birth data exists:
  - Sun sign (calculated from birth date)
  - Moon sign (placeholder or calculated)
  - Rising sign (placeholder or calculated)
  - Brief interpretations (1-2 sentences each)
- If no birth data:
  - Placeholder: "Enter your birth data to unlock your astrological profile"
  - CTA: "Go to Settings"

**Design**:
- Clean cards with icons (☀️ Sun, 🌙 Moon, ⬆️ Rising)
- Color-coded (purple/blue theme)

---

#### 9. **Numerology Module**
**Status**: 🟡 Placeholder  
**Path**: `/numerology`  

**Features**:
- If birth data exists:
  - Life Path Number (calculated from birth date)
  - Expression Number (calculated from name)
  - Brief interpretations
- If no birth data:
  - Placeholder screen
  - CTA: "Enter Birth Data"

**Design**:
- Cards with numbers (1-9)
- Blue theme

---

#### 10. **Human Design Module**
**Status**: 🟡 Placeholder  
**Path**: `/human-design`  

**Features**:
- If birth data exists:
  - Type (Generator, Projector, etc.) - calculated or placeholder
  - Strategy (brief)
  - Authority (brief)
- If no birth data:
  - Placeholder screen
  - CTA: "Enter Birth Data"

**Design**:
- Cards with HD icons
- Orange theme

---

#### 11. **Meditation Module**
**Status**: 🟡 Placeholder (Catalog Screen)  
**Path**: 
- `/meditation` - Catalog
- `/meditation/:id` - Detail (placeholder)

**Features**:
- Catalog screen:
  - List of meditation categories:
    - Morning Meditation
    - Stress Relief
    - Sleep Meditation
    - Chakra Balancing
    - Mindfulness
  - Each card: title, duration, image, "Start" button
- Detail screen (placeholder):
  - Title & description
  - Duration
  - "Play" button (non-functional placeholder)
  - Message: "Audio player coming soon"

**Design**:
- Green/nature theme
- Calm, zen aesthetics

---

### Secondary Modules (Can be Placeholders)

#### 12. **Community Module**
**Status**: 🟡 Placeholder (or minimal)  
**Path**: `/community`  

**Options**:
- **Option A (Placeholder)**:
  - "Community Coming Soon" screen
  - CTA: "Find a Mentor"
- **Option B (Minimal)**:
  - Simple feed (mock posts)
  - No create/comment/like (just read-only)

**Recommendation**: Placeholder for now

---

#### 13. **Courses Module**
**Status**: 🟡 Placeholder  
**Path**: `/courses`  

**Features**:
- "Courses Coming Soon" placeholder
- List of course categories (mock data):
  - Astrology 101
  - Numerology Basics
  - Human Design Fundamentals
- Each card: title, image, "Coming Soon" badge
- No lesson screens (all placeholders)

---

#### 14. **Pro/Subscription Module**
**Status**: ✅ Must Work (Simple)  
**Path**: `/pro`  

**Features**:
- Show Pro features:
  - Unlimited AI Assistant chats
  - Priority mentor booking
  - Advanced natal chart features
  - Exclusive courses
- Pricing tiers (Free, Pro)
- **Mock payment** (no real payment integration)
- "Subscribe" button → update user's Pro status in localStorage

**Navigation**: Via Profile or upsell prompts

---

#### 15. **Notifications Module**
**Status**: ✅ Must Work (Basic)  
**Path**: `/notifications`  

**Features**:
- List of notifications (mock data):
  - "Mentor accepted your booking"
  - "New message from [Mentor Name]"
  - "Your session starts in 1 hour"
- Mark as read
- Clear all

**Navigation**: Via Profile or header icon

---

#### 16. **Admin Module**
**Status**: 🟡 Placeholder  
**Path**: `/admin`  
**Guard**: Admin role only  

**Features**:
- Admin dashboard placeholder
- "Admin features coming soon"

---

#### 17. **Mentor Dashboard Module**
**Status**: 🟡 Placeholder  
**Path**: `/mentor-dashboard`  
**Guard**: Mentor role only  

**Features**:
- Mentor dashboard placeholder
- "Manage your mentorship coming soon"

---

## 🎨 Design System

### Colors (Brand)
- **Primary**: Indigo-500 (`#6366f1`)
- **Secondary**: Purple-500 (`#a855f7`)
- **Success**: Green-600 (`#16a34a`)
- **Warning**: Yellow-500 (`#eab308`)
- **Error**: Red-600 (`#dc2626`)
- **Text**: Slate-900 (light mode), Slate-100 (dark mode)
- **Background**: Slate-50 (light), Slate-950 (dark)

### Typography
- **Font**: Inter (already loaded via Google Fonts)
- **Headings**: Font-bold, text-xl to text-3xl
- **Body**: Font-normal, text-sm to text-base
- **Small**: text-xs

### Components
- **Cards**: Rounded-xl, shadow-sm, border
- **Buttons**: Rounded-full (primary) or rounded-xl (secondary)
- **Inputs**: Rounded-lg, border, focus ring
- **Badges**: Rounded-full, small text, colored background

### Layout
- **Max width**: max-w-md (mobile-first)
- **Padding**: p-4 to p-6
- **Spacing**: space-y-4, gap-4
- **Safe area**: safe-area-pb for bottom nav

---

## 📝 Implementation Plan

### Phase 1: Core Setup (Day 1)
1. ✅ Clean up TypeScript errors
2. ✅ Fix module registry (enable/disable clean)
3. ✅ Implement proper i18n (EN only, keys everywhere)
4. ✅ Bottom navigation (4 items: Home, Mentors, Messages, Profile)
5. ✅ Basic routing works

### Phase 2: Working Modules (Day 2-3)
1. ✅ Home screen (dashboard with quick links)
2. ✅ Mentors module (list, profile, booking flow)
3. ✅ Messages/Chat (localStorage, AI integration)
4. ✅ My Sessions (booking list)
5. ✅ Profile & Settings

### Phase 3: Natal Chart Hub (Day 4)
1. ✅ Natal hub screen (4 sections, no wheel)
2. 🟡 Astrology screen (basic data or placeholder)
3. 🟡 Numerology screen (placeholder)
4. 🟡 Human Design screen (placeholder)
5. 🟡 Meditation catalog (placeholder)

### Phase 4: Polish & Placeholders (Day 5)
1. 🟡 Community placeholder
2. 🟡 Courses placeholder
3. ✅ Pro screen (mock subscription)
4. ✅ Notifications (basic)
5. 🟡 Admin/Mentor dashboards (placeholders)

### Phase 5: Testing & Deployment (Day 6)
1. ✅ Manual smoke test (all screens clickable, no dead ends)
2. ✅ TypeScript validation (no errors)
3. ✅ i18n validation (all keys present)
4. ✅ Build test (`npm run build`)
5. 🚀 Deploy to Cloudflare Pages or Netlify

---

## 🔧 Technical Stack

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- React Router DOM (routing)
- Tailwind CSS (styling)
- Lucide React (icons)

**State Management**:
- Context API (Session, Theme, i18n)
- LocalStorage (chat history, bookings, user data)

**AI Integration**:
- Gemini API (via `VITE_GEMINI_API_KEY` env var)
- Fallback to mock responses if no key

**Services**:
- `chatService.ts` - Chat/messages (localStorage)
- `bookingsService.ts` - Booking management
- `mockData.ts` - Mock mentors, sessions
- `storage.ts` - LocalStorage wrapper
- `aiService.ts` - AI integration (create if missing)

---

## 📚 i18n Namespaces

```typescript
// English keys (all others will follow this structure)
{
  // Navigation
  'nav.home': 'Home',
  'nav.mentors': 'Mentors',
  'nav.messages': 'Messages',
  'nav.sessions': 'My Sessions',
  'nav.profile': 'Profile',
  
  // Common
  'common.back': 'Back',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.loading': 'Loading...',
  'common.comingSoon': 'Coming Soon',
  'common.learnMore': 'Learn More',
  
  // Home
  'home.welcome': 'Welcome, {name}',
  'home.exploreNatal': 'Explore Your Natal Chart',
  'home.findMentor': 'Find a Mentor',
  'home.aiAssistant': 'AI Assistant',
  'home.upcomingSessions': 'Upcoming Sessions',
  
  // Mentors
  'mentors.title': 'Find Your Mentor',
  'mentors.search': 'Search by name or specialty...',
  'mentors.book': 'Book Session',
  'mentors.openChat': 'Open Chat',
  'mentors.notFound': 'Mentor Not Found',
  'mentors.sessionTypes': 'Session Types',
  
  // Chat
  'chat.title': 'Messages',
  'chat.typeMessage': 'Type a message...',
  'chat.send': 'Send',
  'chat.aiAssistant': 'AI Assistant',
  'chat.conversationNotFound': 'Conversation Not Found',
  'chat.upgradeForAI': 'Upgrade to Pro for unlimited AI chats',
  'chat.aiUnavailable': 'AI Assistant is temporarily unavailable',
  
  // Sessions
  'sessions.title': 'My Sessions',
  'sessions.pending': 'Pending Payment',
  'sessions.confirmed': 'Confirmed',
  'sessions.past': 'Past',
  'sessions.noSessions': 'No sessions yet',
  'sessions.bookFirst': 'Book your first session with a mentor',
  
  // Natal
  'natal.title': 'Your Natal Chart',
  'natal.astrology': 'Astrology',
  'natal.numerology': 'Numerology',
  'natal.humanDesign': 'Human Design',
  'natal.meditation': 'Meditation',
  'natal.addBirthData': 'Add birth data to unlock insights',
  
  // Astrology
  'astrology.title': 'Astrology',
  'astrology.sun': 'Sun Sign',
  'astrology.moon': 'Moon Sign',
  'astrology.rising': 'Rising Sign',
  
  // Numerology
  'numerology.title': 'Numerology',
  'numerology.lifePath': 'Life Path Number',
  'numerology.expression': 'Expression Number',
  
  // Human Design
  'humanDesign.title': 'Human Design',
  'humanDesign.type': 'Type',
  'humanDesign.strategy': 'Strategy',
  'humanDesign.authority': 'Authority',
  
  // Meditation
  'meditation.title': 'Meditation',
  'meditation.morning': 'Morning Meditation',
  'meditation.stress': 'Stress Relief',
  'meditation.sleep': 'Sleep Meditation',
  'meditation.start': 'Start',
  
  // Pro
  'pro.title': 'Upgrade to Pro',
  'pro.unlimitedAI': 'Unlimited AI Assistant',
  'pro.priorityBooking': 'Priority Booking',
  'pro.advancedChart': 'Advanced Natal Chart',
  'pro.subscribe': 'Subscribe Now',
  
  // Placeholders
  'placeholder.comingSoon': 'Coming Soon',
  'placeholder.inDevelopment': 'This feature is currently in development',
  'placeholder.stayTuned': 'Stay tuned for updates!',
  'placeholder.backHome': 'Back to Home',
}
```

---

## ✅ Success Criteria

**Must Work**:
- ✅ No TypeScript errors (`npm run typecheck`)
- ✅ No build errors (`npm run build`)
- ✅ No dead-ends (every screen has navigation back)
- ✅ Bottom nav works (4 items)
- ✅ Mentors → Book → Chat flow works end-to-end
- ✅ Chat sends messages, persists to localStorage
- ✅ AI Assistant works (with fallback for no API key / non-Pro)
- ✅ All text uses i18n keys (no hardcoded strings)
- ✅ Placeholders are professional (not broken UI)

**Nice to Have**:
- 🟡 Real astrology calculations
- 🟡 Real numerology calculations
- 🟡 Meditation audio player
- 🟡 Community features

---

## 🚀 Deployment Checklist

1. ✅ `npm run build` succeeds
2. ✅ `npm run typecheck` passes
3. ✅ `npm run lint:i18n` passes
4. ✅ Manual smoke test (15-20 steps)
5. ✅ Deploy to Cloudflare Pages or Netlify
6. ✅ Test production URL
7. ✅ Update README with live URL

---

## 📞 Support

**If something breaks**:
1. Check TypeScript errors first
2. Check i18n keys (missing translations?)
3. Check module registry (enabled modules?)
4. Check localStorage (clear if corrupted)
5. Check console for errors

**Contact**: Open issue on GitHub or message in Slack

---

## 🎉 Final Notes

This is a **modular, maintainable, working application**.  
Every module can be enabled/disabled independently.  
All code is clean, typed, and i18n-ready.  
Placeholders are professional and guide users.  

**Let's build something great!** 🚀
