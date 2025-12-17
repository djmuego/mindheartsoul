# Smoke Test - PROMPT v3 (Fix-first)

**Date**: 2025-12-17  
**Product**: MindHeartSoul - Chat Consultations  
**Dev URL**: https://5182-iydq5cfrmkja0tfc4n2ch-b9b802c4.sandbox.novita.ai

---

## 15-Step Smoke Test (Focus: Chat + Mentors)

### **Step 1: Dev Server Health**
- [ ] Open dev URL
- [ ] Page loads without errors
- [ ] No console errors on initial load
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 2: Navigation Check**
- [ ] Bottom nav visible
- [ ] **VERIFY**: 4 items shown: Mentors / Sessions / Messages / Profile
- [ ] All 4 tabs are clickable
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 3: Mentors List**
- [ ] Click "Mentors" tab
- [ ] List of mentors displays
- [ ] At least 3 mentors visible
- [ ] Each mentor card shows: name, title, rating, avatar
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 4: Mentor Detail (Valid)**
- [ ] Click on first mentor card
- [ ] Navigate to mentor detail page
- [ ] **VERIFY**: Shows mentor name, bio, skills, session types
- [ ] "Book" button visible
- [ ] No blank page, no 404
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 5: Mentor Detail (Invalid)**
- [ ] Manually navigate to `/mentors/invalid_id_123`
- [ ] **VERIFY**: Shows "Mentor Not Found" screen (not blank)
- [ ] "Back to Mentors" button visible
- [ ] Click button → Returns to mentors list
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 6: Booking Flow Start**
- [ ] On valid mentor detail, click "Book" on any session type
- [ ] **VERIFY**: Navigate to booking screen
- [ ] Date selector visible
- [ ] Time slots visible
- [ ] Can select a date and time
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 7: Booking Flow Complete**
- [ ] Select date and time
- [ ] Click "Continue to Confirmation"
- [ ] **VERIFY**: Confirmation screen shows booking summary
- [ ] Click "Confirm & Pay"
- [ ] **VERIFY**: Booking created (appears in Sessions or triggers payment)
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 8: My Sessions Screen**
- [ ] Click "Sessions" tab
- [ ] **VERIFY**: Shows list of bookings (or empty state)
- [ ] If bookings exist: shows mentor name, date, time, status
- [ ] If empty: "No upcoming sessions" + "Find a Mentor" CTA
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 9: Messages List**
- [ ] Click "Messages" tab
- [ ] **VERIFY**: Chat list displays
- [ ] Can see conversations (or empty state)
- [ ] If empty: "No messages yet" message
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 10: Chat Thread (Send)**
- [ ] Click on any conversation (or create test conversation)
- [ ] Type message: "Test message 1"
- [ ] Click Send (or press Enter)
- [ ] **VERIFY**: Message appears in thread immediately
- [ ] **VERIFY**: Input field clears after send
- [ ] **VERIFY**: Send button is disabled when input is empty
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 11: Chat Persistence**
- [ ] Send 2 more messages: "Test 2", "Test 3"
- [ ] Reload page (F5 or Cmd+R)
- [ ] Navigate back to Messages → open same chat
- [ ] **VERIFY**: All 3 messages still visible
- [ ] **VERIFY**: Messages in correct order (oldest to newest)
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 12: AI Assistant (No API Key)**
- [ ] If "AI Assistant" conversation exists, open it
- [ ] Send a message
- [ ] **VERIFY**: AI response shows "temporarily unavailable" (or similar)
- [ ] **VERIFY**: Chat still works (no crash, input still functional)
- [ ] **IF user is non-Pro**: May show upsell message
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 13: Profile Screen**
- [ ] Click "Profile" tab
- [ ] **VERIFY**: Shows user info (name, avatar, stats)
- [ ] **VERIFY**: Settings button visible
- [ ] Click Settings → navigates to Settings screen
- [ ] Navigate back to Profile (using back button or nav)
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 14: Disabled Modules**
- [ ] Manually navigate to `/community`
- [ ] **VERIFY**: Shows "Feature Disabled" screen (not 404)
- [ ] **VERIFY**: CTA buttons visible ("Find a Mentor", "Open Chat", etc.)
- [ ] Click any CTA → navigates to valid screen
- **RESULT**: ✅ PASS / ❌ FAIL

---

### **Step 15: Console Errors**
- [ ] Open browser DevTools (F12) → Console tab
- [ ] Navigate through: Mentors → Booking → Sessions → Messages → Profile
- [ ] **VERIFY**: No critical errors (red) in console
- [ ] **VERIFY**: No "undefined" errors
- [ ] **VERIFY**: No route errors ("Cannot GET /...")
- [ ] Minor warnings (yellow) are OK
- **RESULT**: ✅ PASS / ❌ FAIL

---

## Summary

**Total Tests**: 15  
**Passed**: ___ / 15  
**Failed**: ___ / 15

**Critical Acceptance Criteria**:
- [ ] Mentors list → detail works (no blank pages)
- [ ] Chat send works, persists after reload
- [ ] Navigation has 4 items, all functional
- [ ] No 404 errors or dead links
- [ ] Disabled modules show fallback screen
- [ ] No critical console errors

---

## Known Limitations (Expected)

- ⏳ TypeScript typecheck may timeout (known issue, not blocking)
- 🎨 Some Tailwind dynamic classes may not work (e.g., `bg-${variable}`)
- 🤖 AI responses are mocked (no real AI integration)
- 💳 Payment flow is mocked (no real payment processing)

---

**Tester**: __________  
**Date**: __________  
**Status**: ✅ PASS / ❌ FAIL
