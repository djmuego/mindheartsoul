# Smoke Test: Chat Consultations Only

**Product Scope**: Mentors → Booking → Messages (Chat Consultations)

**Date**: 2025-12-17  
**Version**: Chat Consultations MVP  
**Tester**: _________

---

## 🎯 Test Objective

Verify that the core "Chat Consultations Only" product flow works end-to-end:
- Users can find mentors
- Users can book consultation sessions
- Users can access chat from bookings
- All video-related features are removed
- Disabled modules show appropriate screens (no 404s)

---

## ✅ Pre-Test Setup

1. **Environment**: `npm run dev` server running
2. **Test User**: Logged in as regular user (not Pro, not Mentor)
3. **Clean State**: Clear localStorage or use incognito mode
4. **API Key**: Test both WITH and WITHOUT `VITE_GEMINI_API_KEY`

---

## 📋 Test Steps

### **PHASE 1: Navigation & Module Visibility**

#### Step 1: Check Bottom Navigation
- [ ] Open app home page
- [ ] **VERIFY**: Bottom nav shows exactly 4 items: Home, Mentors, Messages, Profile
- [ ] **VERIFY**: No "Community", "Natal", or other disabled modules in nav
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 2: Attempt to Access Disabled Modules
- [ ] Try to navigate to `/community` manually in URL
- [ ] **VERIFY**: Shows DisabledScreen (not 404)
- [ ] **VERIFY**: "Temporarily unavailable" message shown
- [ ] **VERIFY**: CTA buttons: "Find Mentor", "Open Chat", "Back to Home"
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 3: Check for Video References
- [ ] Search entire UI for "video", "join", "camera" text
- [ ] **VERIFY**: No video-related UI elements visible
- [ ] **VERIFY**: No camera/video icons in any screens
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

### **PHASE 2: Mentors Flow**

#### Step 4: Browse Mentors
- [ ] Navigate to Mentors tab
- [ ] **VERIFY**: List of mentors displays
- [ ] **VERIFY**: Each mentor shows name, title, rating, tags
- [ ] **VERIFY**: Click on a mentor card
- [ ] **VERIFY**: Navigates to mentor profile (no blank page)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 5: View Mentor Profile
- [ ] On mentor profile page
- [ ] **VERIFY**: Shows mentor details (bio, languages, skills)
- [ ] **VERIFY**: Shows available session types
- [ ] **VERIFY**: "Book" button visible for each session type
- [ ] **VERIFY**: NO "Video Session" option shown
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

### **PHASE 3: Booking Flow**

#### Step 6: Create Booking
- [ ] Click "Book" on a session type
- [ ] **VERIFY**: Navigate to booking screen (`/book/:mentorId`)
- [ ] **VERIFY**: Shows mentor name, session details
- [ ] **VERIFY**: Date selector works (7-day range)
- [ ] **VERIFY**: Time slots are selectable
- [ ] **VERIFY**: Can add optional note
- [ ] **VERIFY**: "Continue to Confirmation" button enabled
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 7: Confirm Booking
- [ ] Click "Continue to Confirmation"
- [ ] **VERIFY**: Navigate to confirmation screen
- [ ] **VERIFY**: Shows booking summary (mentor, date, time, price)
- [ ] **VERIFY**: "Confirm & Pay" button visible
- [ ] Click "Confirm & Pay"
- [ ] **VERIFY**: Payment modal or redirect appears
- [ ] **VERIFY**: After payment, booking created
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

### **PHASE 4: Booking → Chat Integration**

#### Step 8: View Booking Detail
- [ ] Navigate to Profile tab
- [ ] (Booking should appear in recent history, or navigate directly to `/booking/:id`)
- [ ] Open a booking detail page
- [ ] **VERIFY**: Shows booking status (pending/confirmed/cancelled)
- [ ] **VERIFY**: Shows mentor info, date/time, session type
- [ ] **VERIFY**: NO "Join Video Session" button
- [ ] **VERIFY**: "Open Chat" button visible (MessageCircle icon)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 9: Open Chat from Booking
- [ ] Click "Open Chat" on BookingDetailScreen
- [ ] **VERIFY**: Navigates to chat thread (`/chat/mentor:<mentorId>` or `/chat/session:<bookingId>`)
- [ ] **VERIFY**: Chat screen opens (not 404)
- [ ] **VERIFY**: Shows mentor name in header
- [ ] **VERIFY**: Shows input field and send button
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

### **PHASE 5: Messages Functionality**

#### Step 10: Send Message in Mentor Chat
- [ ] In chat thread with mentor
- [ ] Type a message: "Hello, I'm looking forward to our session"
- [ ] Click Send
- [ ] **VERIFY**: Message appears in thread instantly
- [ ] **VERIFY**: Input field clears after send
- [ ] **VERIFY**: Send button disabled while empty
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 11: Chat History Persistence
- [ ] Send 3-5 messages in the mentor chat
- [ ] Navigate away (go to Home or Mentors)
- [ ] Navigate back to Messages tab
- [ ] Open the same mentor chat
- [ ] **VERIFY**: All previous messages still visible
- [ ] Reload page (hard refresh)
- [ ] **VERIFY**: Messages still persist after reload
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 12: AI Assistant Chat (Pro Gating)
- [ ] Navigate to Messages → Chat List
- [ ] **VERIFY**: "AI Assistant" dialog visible in list
- [ ] Click on "AI Assistant"
- [ ] Send a message
- [ ] **IF API key is missing**:
   - [ ] **VERIFY**: AI response shows "AI temporarily unavailable" or similar stub
   - [ ] **VERIFY**: Chat UI does NOT break (input still works)
- [ ] **IF user is NOT Pro**:
   - [ ] **VERIFY**: Shows "Upgrade to Pro" message after sending
   - [ ] **VERIFY**: No AI response generated
- [ ] **IF user is Pro AND API key present**:
   - [ ] **VERIFY**: AI mock response appears after delay
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

### **PHASE 6: Edge Cases & Error Handling**

#### Step 13: Empty States
- [ ] Navigate to Messages with no conversations
- [ ] **VERIFY**: Shows "No messages yet" or similar empty state
- [ ] **VERIFY**: CTA to start conversation (if applicable)
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 14: Invalid Routes
- [ ] Try to access `/sessions/:sessionId` (old video route)
- [ ] **VERIFY**: Shows NotFoundScreen OR redirects to valid page
- [ ] **VERIFY**: No blank/broken page
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

#### Step 15: Console Errors
- [ ] Open browser DevTools console
- [ ] Navigate through entire flow: Home → Mentors → Booking → Chat
- [ ] **VERIFY**: No critical errors (red) in console
- [ ] **VERIFY**: No video-related errors (e.g., "SessionJoinScreen not found")
- [ ] **RESULT**: ✅ PASS / ❌ FAIL
- **Notes**: _________

---

## 🎯 Summary

**Total Tests**: 15  
**Passed**: ___ / 15  
**Failed**: ___ / 15  
**Blocked**: ___ / 15

---

## 📝 Critical Issues Found

_(List any blocking issues that prevent core flow from working)_

1. 
2. 
3. 

---

## 🔧 Non-Critical Issues

_(List minor issues, UI glitches, suggestions)_

1. 
2. 
3. 

---

## ✅ Sign-Off

- [ ] Core flow (Mentors → Booking → Chat) is functional
- [ ] Video features completely removed
- [ ] Disabled modules show appropriate screens
- [ ] Navigation limited to 4 items
- [ ] No critical console errors
- [ ] i18n strings present and correct

**Tester Signature**: __________  
**Date**: __________

---

## 📚 Related Documentation

- [STATUS_AUDIT_REALITY.md](./STATUS_AUDIT_REALITY.md) - Full audit of app state
- [PROMPTS_LOG.md](./PROMPTS_LOG.md) - Sprint requirements and decisions
- [BUG_REPORT.md](./BUG_REPORT.md) - Known bugs and fixes
