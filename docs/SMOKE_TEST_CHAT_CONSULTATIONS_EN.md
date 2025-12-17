# Smoke Test: Chat Consultations Only (EN-first)

**Product**: MindHeartSoul - Chat Consultations  
**Date**: 2025-12-17  
**Tester**: _________  
**Dev URL**: https://5182-iydq5cfrmkja0tfc4n2ch-b9b802c4.sandbox.novita.ai

---

## 🎯 Test Objective

Verify that the core "Mentors → Booking → Messages" flow works end-to-end in English.

---

## ✅ Pre-Test Setup

1. **Server**: Dev server running
2. **Language**: EN (all text in English, other locales are EN aliases)
3. **Test User**: Regular user (not Pro, not Mentor)
4. **Clean State**: Incognito mode or cleared localStorage

---

## 📋 12-Step Smoke Test

### **Step 1: Navigation Check**
- [ ] Open app
- [ ] **VERIFY**: Bottom nav shows **4 items**: Mentors / Sessions / Messages / Profile
- [ ] **VERIFY**: NO Home, Community, or Natal tabs visible
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 2: Mentors List**
- [ ] Click "Mentors" tab
- [ ] **VERIFY**: List of mentors displays with names, titles, ratings
- [ ] **VERIFY**: All mentor cards are clickable
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 3: Mentor Profile**
- [ ] Click on any mentor
- [ ] **VERIFY**: Profile shows mentor details (bio, skills, languages)
- [ ] **VERIFY**: Session types listed with prices
- [ ] **VERIFY**: "Book" button visible for each session type
- [ ] **VERIFY**: NO "Video Session" option shown
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 4: Booking Flow**
- [ ] Click "Book" on a session type
- [ ] **VERIFY**: Navigate to booking screen with date/time selector
- [ ] Select a date and time
- [ ] Click "Continue to Confirmation"
- [ ] **VERIFY**: Confirmation screen shows booking summary
- [ ] Click "Confirm & Pay"
- [ ] **VERIFY**: Booking created (status: pending or confirmed)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 5: My Sessions Screen**
- [ ] Click "Sessions" tab in bottom nav
- [ ] **VERIFY**: Shows list of user's bookings
- [ ] **VERIFY**: Each booking shows mentor name, date, time, status
- [ ] **VERIFY**: Bookings grouped by: Confirmed / Pending / History
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 6: Open Chat from Booking**
- [ ] On a confirmed booking card, click "Open Chat"
- [ ] **VERIFY**: Navigate to chat thread (`/chat/mentor:<mentorId>`)
- [ ] **VERIFY**: Chat screen opens (not 404)
- [ ] **VERIFY**: Shows mentor name in header
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 7: Send Message**
- [ ] Type message: "Hello, looking forward to our session"
- [ ] Click Send
- [ ] **VERIFY**: Message appears in thread instantly
- [ ] **VERIFY**: Input field clears after send
- [ ] **VERIFY**: Send button is disabled when input is empty
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 8: Message Persistence**
- [ ] Send 3 more messages
- [ ] Navigate away (click "Sessions" tab)
- [ ] Navigate back to "Messages" tab
- [ ] Open the same chat
- [ ] **VERIFY**: All 4 messages still visible
- [ ] Reload page (hard refresh F5)
- [ ] **VERIFY**: All messages persist after reload
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 9: AI Assistant (No Pro)**
- [ ] Navigate to "Messages" tab
- [ ] **VERIFY**: "AI Assistant" conversation visible in list
- [ ] Click on "AI Assistant"
- [ ] Send a message
- [ ] **IF user is NOT Pro**: 
  - [ ] **VERIFY**: Response shows "AI insights available for Pro members" or similar
  - [ ] **VERIFY**: UI does NOT break (input still works)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 10: Disabled Modules**
- [ ] Try to navigate to `/community` manually in URL
- [ ] **VERIFY**: Shows "Feature Disabled" screen (not 404)
- [ ] **VERIFY**: "Find a Mentor" and "Open Chat" CTAs visible
- [ ] Try to navigate to `/natal`
- [ ] **VERIFY**: Same disabled screen or redirect
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 11: Home Screen (Simplified)**
- [ ] Navigate to `/home` (or click brand logo if accessible)
- [ ] **VERIFY**: Home shows:
  - Upcoming Sessions section
  - Recommended Mentors section
  - Notifications preview
- [ ] **VERIFY**: Home does NOT show:
  - Community Highlights
  - Continue Learning (Courses)
  - Birth Profile CTA (Astrology)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 12: Console Errors**
- [ ] Open browser DevTools console (F12)
- [ ] Navigate through: Mentors → Booking → Sessions → Messages
- [ ] **VERIFY**: No critical errors (red) in console
- [ ] **VERIFY**: No video-related errors
- [ ] **VERIFY**: No missing i18n key warnings
- [ ] **RESULT**: ✅ PASS / ❌ FAIL

---

## 🎯 Summary

**Total Tests**: 12  
**Passed**: ___ / 12  
**Failed**: ___ / 12

---

## ✅ Critical Acceptance Criteria

- [ ] Navigation: 4 items (Mentors/Sessions/Messages/Profile)
- [ ] Video features completely removed
- [ ] Booking → Chat flow works end-to-end
- [ ] Messages persist after page reload
- [ ] AI Assistant graceful fallback (no crashes)
- [ ] Disabled modules show "Feature Disabled" screen
- [ ] Home screen simplified (no disabled module sections)
- [ ] No critical console errors
- [ ] All text in English (i18n EN-first strategy)

---

## 📝 Notes

**i18n Strategy**: All locales (RU/DE/ES/PL) are aliases of EN during development. Real translations will be backfilled in separate PR after core functionality is stable.

**Known Limitations**:
- Home tab not in bottom nav (users land on /home but no tab)
- AI Assistant responses are mocked (no real AI integration)
- Payment flow is mocked (no real payment processing)

---

**Tester Signature**: __________  
**Date**: __________
