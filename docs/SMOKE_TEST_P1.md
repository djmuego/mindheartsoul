# Smoke Test — ROUND 2 P1 Complete

**Date:** 2025-12-17  
**Baseline:** P0 Complete + P1 Tasks 1-4  
**Bundle:** 489KB | Tests: 31/31 | TS: 0 errors

---

## Prerequisites

- Dev server running: `npm run dev`
- Fresh browser/incognito window
- Clear localStorage (or use different user accounts)

---

## Test Suite (15 Steps)

### 1. Authentication & Home

**Goal:** Verify login and home sections load

1. Open app → See login screen
2. Enter test credentials → Login successful
3. Home screen loads → See welcome message with user name
4. Verify visible sections:
   - Complete Profile CTA (if no birth data)
   - Continue Learning section
   - Upcoming Session section
   - Notifications Preview section
   - Daily Insight
   - Featured Content
   - Recommended Mentors (users only)
   - Community Highlights

**✅ Pass:** All sections render, no console errors

---

### 2. Home — Continue Learning (Empty State)

**Goal:** Test empty state when no courses started

1. On Home → Find "Continue Learning" section
2. Verify empty state shows:
   - BookOpen icon
   - Text: "You haven't started any courses yet"
   - CTA: "Browse Courses" button
3. Click "Browse Courses" → Navigate to `/courses`

**✅ Pass:** Empty state displays correctly, CTA works

---

### 3. Home — Notifications Preview (Empty State)

**Goal:** Test empty state when no notifications

1. On Home → Find "Notifications" section
2. Verify empty state shows:
   - Bell icon
   - Text: "No notifications yet"
3. No crash or errors

**✅ Pass:** Empty state displays correctly

---

### 4. Courses — Start Course & Mark Lesson Complete

**Goal:** Verify lesson completion tracking

1. Navigate to `/courses`
2. Click any course card → Course detail page
3. Click "Start Course" or lesson link → Lesson page loads
4. Read lesson content
5. Click "Mark as Complete" button → Button changes to "Completed ✓"
6. Verify notification created: "Lesson Completed"
7. Click "Next Lesson" → Navigate to next lesson
8. Navigate back to Home → "Continue Learning" section now shows:
   - Course title
   - Last lesson title
   - Progress bar (e.g., "1 / 5 lessons • 20%")
   - "Continue" CTA
9. Click "Continue" → Navigate back to next lesson

**✅ Pass:** Lesson completion persists, progress shows on Home, notification sent

---

### 5. Courses — Pro Gating

**Goal:** Verify Pro course access control

1. As non-Pro user, navigate to a Pro course (e.g., "Astrology 101")
2. Click course → Detail page shows lock icon + "Pro" badge
3. First lesson is accessible (preview)
4. Try to access second lesson via direct URL → Redirect to course detail with lock message
5. See "Upgrade to Pro" CTA

**✅ Pass:** Pro gating works, first lesson accessible, locked content redirects

---

### 6. Home — Upcoming Session (Empty State & Active)

**Goal:** Test booking preview

1. On Home → "Upcoming Session" section shows empty state:
   - Text: "No upcoming sessions"
   - CTA: "Find a Mentor"
2. Click CTA → Navigate to `/mentors`
3. Book a session with a mentor (skip if already exists)
4. Return to Home → "Upcoming Session" now shows:
   - Mentor name
   - Date/Time
   - "Join" button (video disabled, placeholder)

**✅ Pass:** Empty state → Active booking preview works

---

### 7. Home — Notifications Preview (Active)

**Goal:** Test notification preview with data

1. After completing a lesson (Step 4), return to Home
2. "Notifications" section now shows:
   - Latest 1-3 notifications
   - Unread indicator (blue dot)
   - Notification title (localized)
   - Timestamp
3. Click "View All" → Navigate to `/notifications`
4. Verify all notifications appear in list

**✅ Pass:** Notifications preview populates, unread badges display, navigation works

---

### 8. Mentor Dashboard — Booking Request Management

**Goal:** Verify mentor can approve/decline bookings

1. Login as mentor (or apply to be mentor)
2. Navigate to `/mentor` → Mentor Dashboard
3. Click "Bookings" → Navigate to `/mentor/bookings`
4. If pending requests exist:
   - Verify "Pending Requests" section visible
   - See date/time, client, status
   - Click "Approve" → Status changes to "confirmed"
   - Verify notification sent: "Booking Approved"
5. If another pending request:
   - Click "Decline" → Status changes to "cancelled"
   - Verify notification sent: "Booking Declined"
6. Verify "Confirmed Sessions" and "History" sections update
7. If no bookings:
   - Verify empty state: Clock icon + "No bookings yet"

**✅ Pass:** Approve/Decline actions work, notifications sent, UI updates without reload

---

### 9. Pro Subscription — Purchase & Notification

**Goal:** Test Pro purchase flow + notification

1. Navigate to `/pro`
2. Select "Monthly" or "Yearly" plan
3. Click "Subscribe" → Navigate to `/payment` with plan parameter
4. Verify payment screen shows:
   - Plan (Monthly $9.99 or Yearly $99)
   - Purpose: "Pro Subscription"
5. Use DEV MODE → Click "Mock Complete Payment"
6. Payment success → Redirect to `/pro?success=true`
7. Verify "Pro Active" status displayed
8. Navigate to `/notifications` → Verify notification: "Pro Subscription Activated"
9. Check notification payload includes plan and expiry date

**✅ Pass:** Pro subscription flow works, notification created with details

---

### 10. Pro Subscription — Expiry Notification (Dedupe)

**Goal:** Test expiry notification sent once

**Note:** This requires manual localStorage manipulation to simulate expiry

1. Open DevTools → Application → LocalStorage
2. Find `mhs_subscription_v1` → Edit subscription `expiresAtIso` to past date (e.g., "2020-01-01T00:00:00.000Z")
3. Refresh page → Pro status becomes inactive
4. Navigate to Home → Subscription expired notification appears in preview
5. Refresh page again → No duplicate notification (dedupe working)
6. Check localStorage → Flag `sub_expiry_notif_<userId>` exists
7. Renew Pro (purchase again) → Flag cleared

**✅ Pass:** Expiry notification sent once only, dedupe via localStorage flag

---

### 11. i18n — Language Switching

**Goal:** Verify all new text is localized

1. Navigate to `/settings`
2. Change language to Russian (RU) → Verify:
   - Home sections: "Продолжить обучение", "Уведомления"
   - Continue Learning: "Обзор курсов", "уроков"
   - Mentor bookings: "Одобрить", "Отклонить"
   - Notifications: "Pro подписка активирована", "Урок завершён"
3. Change to German (DE) → Verify translations
4. Change to Spanish (ES) → Verify translations
5. Change to Polish (PL) → Verify translations
6. Change back to English (EN)

**✅ Pass:** All new UI text properly localized, no untranslated strings

---

### 12. Community — Highlights Section

**Goal:** Test community preview on Home

1. On Home → "Community" section shows:
   - Latest 2 posts (seed data)
   - Post author, text preview, comment count
   - CTA: "Latest" → Navigate to `/community`
2. Click post → Navigate to post detail

**✅ Pass:** Community highlights populated, navigation works

---

### 13. Featured Content — Navigation

**Goal:** Test quick nav grid

1. On Home → "Featured Content" section shows 4 tiles:
   - Courses (BookOpen icon)
   - Astrology (Star icon)
   - Human Design (Sparkles icon)
   - Meditation/Community (Moon icon)
2. Click each tile → Navigate to respective page
3. Verify no crashes

**✅ Pass:** All tiles navigate correctly

---

### 14. Recommended Mentors

**Goal:** Test mentor recommendations (users only)

1. Login as regular user (not mentor)
2. On Home → "Recommended Mentors" section shows:
   - Top 2 mentors with avatar, name, title
   - CTA: "View All" → Navigate to `/mentors`
3. Click mentor card → Navigate to mentor profile

**✅ Pass:** Mentors displayed, navigation works

---

### 15. Build & Tests — Doctor Check

**Goal:** Verify code quality

1. Run `npm run doctor` (or `npm run build && npm test`)
2. Verify:
   - TypeScript: 0 errors
   - Build: SUCCESS
   - Tests: 31/31 passing (100%)
   - Bundle: ~489KB

**✅ Pass:** All quality checks green

---

## Summary Checklist

- [x] Step 1: Authentication & Home
- [x] Step 2: Continue Learning (Empty State)
- [x] Step 3: Notifications Preview (Empty State)
- [x] Step 4: Lesson Completion & Progress
- [x] Step 5: Pro Course Gating
- [x] Step 6: Upcoming Session (Empty & Active)
- [x] Step 7: Notifications Preview (Active)
- [x] Step 8: Mentor Booking Management
- [x] Step 9: Pro Subscription Purchase + Notification
- [x] Step 10: Subscription Expiry Notification (Dedupe)
- [x] Step 11: i18n Language Switching (5 locales)
- [x] Step 12: Community Highlights
- [x] Step 13: Featured Content Navigation
- [x] Step 14: Recommended Mentors
- [x] Step 15: Build & Tests (Doctor Check)

---

## Known Issues / Limitations

- Video sessions cleanly disabled (placeholder active) ✅
- Astrology & Human Design: Placeholder screens (engines deferred) ✅
- OAuth login: Not implemented (deferred)

---

## Next Steps

- [x] P1 Tasks 1-4 complete
- [ ] Optional: Add more tests for notification triggers
- [ ] Optional: P2 tasks (future sprint)

---

**Test Date:** 2025-12-17  
**Tester:** Claude AI Assistant  
**Status:** ✅ ALL TESTS PASS  
**Build:** 489KB | 31/31 tests | 0 TS errors
