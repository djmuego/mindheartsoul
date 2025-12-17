# STATUS AUDIT — Round 1: Close The Loops

**Date**: 2025-12-17  
**Goal**: Full audit of MindHeartSoul MVP to identify broken flows, placeholders, and missing implementations.

---

## MODULE STATUS OVERVIEW

| Module | Status | Notes |
|--------|--------|-------|
| Auth | ✅ DONE | Login/Register/Onboarding complete |
| Home | ⚠️ PARTIAL | Sections work but some are placeholders |
| Profile | ✅ DONE | Profile + Blueprint + Settings |
| Natal | ✅ DONE | Birth profile + charts working |
| Astrology | ⚠️ PLACEHOLDER | Mock data, needs engine |
| Human Design | ⚠️ PLACEHOLDER | Simple placeholder, needs Bodygraph renderer |
| Mentors | ✅ DONE | List + Profile + Booking flow |
| Booking | ⚠️ PARTIAL | Flow works but payment integration incomplete |
| Courses | ✅ DONE | CRUD + Payment + Progress tracking |
| Community | ✅ DONE | Posts + Comments + Reports + Admin moderation |
| Chat | ✅ DONE | User↔Mentor chat working |
| Video Sessions | ❌ BROKEN | Needs to be DISABLED with proper placeholder |
| Payments | ⚠️ PARTIAL | Apirone integration done, but Pro subscription model broken |
| Pro | ❌ BROKEN | Lifetime model, needs monthly/yearly plans |
| Admin | ✅ DONE | Dashboard + Reports moderation |
| Notifications | ⚠️ PARTIAL | System works but not all events trigger notifications |

---

## CRITICAL ISSUES (P0) — MUST FIX NOW

### 1. **PRO SUBSCRIPTION MODEL — BROKEN** ❌
**Current State**:
- Pro is "Lifetime Access" for $9.99 (one-time payment)
- No subscription expiry logic
- No monthly/yearly plans
- No renewal mechanism

**Expected Behavior**:
- Monthly plan: $9.99/month (auto-renews)
- Yearly plan: $99/year (auto-renews, 17% discount)
- Subscription has `expiresAtIso` field
- After expiry, user loses Pro access
- Payment flow supports subscription purpose

**Files to Fix**:
- `src/types.ts` — Add `SubscriptionPlan` type ('monthly' | 'yearly')
- `src/components/screens/ProScreen.tsx` — Show both plans with pricing
- `src/components/screens/payment/PaymentScreen.tsx` — Handle subscription with expiry
- `src/hooks/useEntitlements.ts` — Check expiry date
- `src/services/payments/paymentsService.ts` — Add subscription renewal logic

**Reproduction**:
1. Go to Profile → Pro
2. Click "Upgrade to Pro"
3. Pay $9.99
4. Result: Pro activated forever (WRONG)
5. Expected: Pro active for 1 month, then expires

---

### 2. **VIDEO SESSIONS — MUST DISABLE CLEANLY** ❌
**Current State**:
- `SessionJoinScreen` tries to join Jitsi video
- Booking flow creates video sessions
- Users expect video to work but it doesn't

**Expected Behavior**:
- Replace `SessionJoinScreen` with "Video Temporarily Disabled" message
- Show CTA: "Contact your mentor directly" or "Open external link"
- Remove dependency on `videoService` from booking flow
- Booking can still be created but meetingUrl is optional/null

**Files to Fix**:
- `src/components/screens/SessionJoinScreen.tsx` — Replace with disabled screen
- `src/services/videoService.ts` — Mark as deprecated or stub
- `src/components/screens/BookingDetailScreen.tsx` — Hide "Join Session" button if video disabled
- Feature flag: `videoEnabled: false` by default

**Reproduction**:
1. Book a session with mentor
2. Go to Profile → Booking History
3. Click on booking → "Join Session" button
4. Result: Shows "can_join" but video doesn't work
5. Expected: Show "Video temporarily disabled, contact mentor"

---

### 3. **BOOKING → PAYMENT FLOW — INCOMPLETE** ⚠️
**Current State**:
- Booking created with status 'pending_payment'
- Payment screen opens
- After payment simulation, no clear success state
- Booking status not updated to 'confirmed'
- No notification sent

**Expected Behavior**:
1. User books session → Booking created (status: pending_payment)
2. Redirects to Payment screen
3. User pays → Payment marked 'succeeded'
4. Booking status updated to 'confirmed'
5. Notification sent: "Booking confirmed"
6. Success screen shown or redirect to Booking Detail

**Files to Fix**:
- `src/components/screens/payment/PaymentScreen.tsx` — After payment success for 'booking', update booking status
- `src/services/bookingService.ts` — Add `confirmBooking(bookingId)` function
- `src/services/notificationService.ts` — Trigger 'booking_confirmed' notification
- `src/components/screens/BookingConfirmScreen.tsx` — Show success state

**Reproduction**:
1. Go to Mentors → Select mentor → Book session
2. Select time → Confirm → Redirects to Payment
3. Select USDT → Generate address → Simulate payment
4. Result: Redirects to `/bookings/{id}?success=true` but booking still 'pending_payment'
5. Expected: Booking status 'confirmed' + notification

---

### 4. **i18n MIXED LANGUAGES** ⚠️
**Current State**:
- Some screens have hardcoded English text in Russian locale
- Missing translation keys in DE/ES/PL
- Inconsistent key naming

**Expected Behavior**:
- All UI text uses i18n keys
- All keys exist in EN/RU/DE/ES/PL
- No hardcoded strings

**Files to Audit**:
- All `*Screen.tsx` files
- Check for hardcoded strings like "Coming Soon", "Free", "Buy", etc.

---

## PARTIAL IMPLEMENTATIONS (P1) — FINISH THESE

### 5. **COURSES — LESSON PROGRESS UI** ⚠️
**Current State**:
- Progress tracked in storage
- Lesson completion works
- Progress bar shows on course cards
- But lesson screen doesn't show "Mark Complete" button clearly

**Expected Behavior**:
- LessonScreen shows "Mark as Complete" button at bottom
- After completion, redirect to next lesson or back to course
- Show completion checkmark

**Files to Check**:
- `src/components/screens/LessonScreen.tsx`

---

### 6. **MENTOR DASHBOARD — INCOMPLETE** ⚠️
**Current State**:
- MentorDashboardScreen exists
- Shows stats (bookings, earnings)
- But no way to manage availability or view booking requests

**Expected Behavior**:
- Mentor can see upcoming bookings
- Mentor can manage availability (set schedule)
- Mentor can view booking requests (if pending approval system added)

**Files to Check**:
- `src/components/screens/MentorDashboardScreen.tsx`
- `src/components/screens/MentorBookingsScreen.tsx`
- `src/components/screens/MentorAvailabilityScreen.tsx`

---

### 7. **HOME SCREEN SECTIONS — PLACEHOLDERS** ⚠️
**Current State**:
- Home shows: Daily Affirmation, Natal Chart, AI Guide, Featured Mentors, Community Posts, Courses
- Some sections are static cards with no real data

**Expected Behavior**:
- All sections should show real data or clear CTA
- "Complete Your Profile" only shows if birthProfile is missing
- Featured Mentors should pull from mentor list
- Community Posts should show latest posts

**Files to Check**:
- `src/components/screens/HomeScreen.tsx`

---

### 8. **NOTIFICATIONS — NOT ALL EVENTS TRIGGER** ⚠️
**Current State**:
- Notification system works
- But many events don't create notifications (e.g., course purchase, mentor approval, booking confirmation)

**Expected Behavior**:
- Booking confirmed → notification
- Payment success → notification
- Course purchased → notification
- Mentor approved → notification

**Files to Fix**:
- Add notification triggers in service functions

---

## PLACEHOLDERS (P2) — ARCHITECTURE READY

### 9. **ASTROLOGY SCREEN — MOCK DATA** 📋
**Status**: Architecture ready, mock data in place  
**What's Missing**: Real astrology engine (chart calculations)  
**Current**: Shows mock "Deep dive into planetary transits. Coming soon."  
**Action**: Keep as is for now, engine will be added later

---

### 10. **HUMAN DESIGN — SIMPLE PLACEHOLDER** 📋
**Status**: Simple "Coming Soon" placeholder (you just fixed this)  
**What's Missing**: Bodygraph SVG renderer + HD engine  
**Action**: Add Bodygraph renderer architecture (see Round 1 tasks)

---

## BROKEN FLOWS — STEP-BY-STEP REPRODUCTION

### Flow 1: Pro Subscription Purchase ❌
1. Go to Profile
2. Click "Pro" section
3. Click "Upgrade to Pro" ($9.99)
4. Select USDT → TRC-20
5. Click "Continue to Payment"
6. Generate address + Simulate payment
7. **ISSUE**: Pro activated but with no expiry date
8. **EXPECTED**: Pro active for 1 month, expiresAtIso set

### Flow 2: Video Session Join ❌
1. Book a session with mentor
2. Confirm booking → Pay
3. Go to Profile → Booking History
4. Click booking → "Join Session"
5. **ISSUE**: Shows video join screen but video doesn't work
6. **EXPECTED**: "Video temporarily disabled" screen

### Flow 3: Booking Payment Confirmation ⚠️
1. Book session → Redirects to payment
2. Pay via crypto simulation
3. **ISSUE**: Redirects but booking status not updated, no notification
4. **EXPECTED**: Booking confirmed + notification + success screen

### Flow 4: Course Purchase ✅
1. Go to Courses
2. Select paid course (e.g., "Heal Your Inner Child" $14.99)
3. Click "Buy Course"
4. Pay via crypto
5. **RESULT**: Works correctly, course unlocked ✅

### Flow 5: Community Post Report → Admin Moderation ✅
1. Create post in Community
2. Report post (as another user)
3. Login as Admin
4. Go to Admin → Community Reports
5. Hide/Delete/Ban actions work
6. **RESULT**: Works correctly ✅

---

## TEST STATUS

| Test Suite | Status | Issues |
|------------|--------|--------|
| homeSections.test.ts | ✅ PASS | None |
| guards.test.tsx | ✅ PASS | None |
| blueprint.test.tsx | ✅ PASS | None |
| validation.test.ts | ✅ PASS | None |
| notifications.test.ts | ✅ PASS | None |
| aiLimits.test.ts | ✅ PASS | None |
| storageDriver.test.ts | ✅ PASS | None |

**Total**: 31/31 tests passing ✅  
**Coverage**: Basic flows covered, need to add tests for new Pro subscription logic

---

## SUMMARY: WHAT TO FIX IN ROUND 1

### P0 (Critical — Do First):
1. ✅ **Pro Subscription Model** — Add monthly/yearly plans with expiry
2. ✅ **Video Sessions** — Disable cleanly with proper placeholder
3. ✅ **Booking Payment Flow** — Complete end-to-end with status update + notification
4. ✅ **i18n Cleanup** — Remove hardcoded strings, add missing keys

### P1 (Important — Do Next):
5. **Courses Lesson Progress** — Add "Mark Complete" button
6. **Mentor Dashboard** — Add booking management
7. **Home Sections** — Connect to real data
8. **Notifications** — Add triggers for all events

### P2 (Nice to Have — Later):
9. **Astrology Screen** — Keep placeholder, engine later
10. **Human Design Bodygraph** — Add SVG renderer architecture

---

## FILES REQUIRING CHANGES

### P0 Changes:
```
src/types.ts — Add SubscriptionPlan type
src/components/screens/ProScreen.tsx — Show monthly/yearly plans
src/components/screens/payment/PaymentScreen.tsx — Handle subscription expiry
src/hooks/useEntitlements.ts — Check subscription expiry
src/services/payments/paymentsService.ts — Subscription logic
src/components/screens/SessionJoinScreen.tsx — Disable video, show placeholder
src/services/bookingService.ts — Add confirmBooking()
src/services/notificationService.ts — Add notification triggers
src/i18n/locales/* — Add missing keys (EN/RU/DE/ES/PL)
```

### P1 Changes:
```
src/components/screens/LessonScreen.tsx — Add completion button
src/components/screens/MentorDashboardScreen.tsx — Booking management
src/components/screens/HomeScreen.tsx — Connect real data
```

---

## NEXT STEPS

1. Create this audit file ✅
2. Fix P0 issues in order
3. Run `npm run doctor` after each fix
4. Update `docs/PROMPTS_LOG.md` with checkpoint
5. Create smoke test checklist (10-15 steps)

---

**Status**: AUDIT COMPLETE  
**Ready for**: P0 Fixes Implementation
