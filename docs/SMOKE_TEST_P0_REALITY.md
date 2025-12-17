# P0 Reality Fix - Smoke Test

**Date**: 2025-12-17  
**Sprint**: Chat Consultations Only - P0 Reality Fixes  
**Dev Server**: https://5182-iydq5cfrmkja0tfc4n2ch-b9b802c4.sandbox.novita.ai

## Test Objective
Verify that all critical P0 fixes work end-to-end:
- Messages/Chat: Immediate send, persistence, error handling
- Mentors: No blank pages, "Open Chat" CTA works
- Natal: No dead-ends, disabled features show modal

## Pre-Conditions
- Dev server running
- User logged in
- Browser console open (to catch errors)

---

## PHASE 2: Messages/Chat (7 steps)

### Step 1: Navigate to Messages
- **Action**: Click "Messages" in bottom nav
- **Expected**: ChatListScreen opens, shows at least 1 conversation (or empty state)
- **Status**: ✅ / ❌

### Step 2: Open a conversation
- **Action**: Click any conversation in the list (or create one via Mentor → Open Chat)
- **Expected**: ChatThreadScreen opens, shows header with participant name, messages (if any), input field
- **Status**: ✅ / ❌

### Step 3: Send a message (immediate UI update)
- **Action**: Type "Hello test" → Press Enter
- **Expected**: 
  - ✅ Message appears IMMEDIATELY in chat (no 3s delay)
  - ✅ Input field clears instantly
- **Status**: ✅ / ❌

### Step 4: Verify persistence (reload)
- **Action**: Reload page (F5)
- **Expected**: 
  - ✅ Message "Hello test" still visible
  - ✅ No loss of chat history
- **Status**: ✅ / ❌

### Step 5: Test invalid conversation ID
- **Action**: Navigate to `/chat/invalid-conv-12345` (manual URL change)
- **Expected**: 
  - ✅ See "Conversation Not Found" screen (not infinite "Loading...")
  - ✅ "Back to Chats" button present
- **Status**: ✅ / ❌

### Step 6: Click "Back to Chats"
- **Action**: Click the button
- **Expected**: ✅ Navigates to `/chat` (list screen)
- **Status**: ✅ / ❌

### Step 7: AI Assistant (Pro gating)
- **Action**: In an AI conversation (e.g., Support Bot), send a message
- **Expected**: 
  - If API key missing: "AI assistant is temporarily unavailable" (chat still works)
  - If non-Pro: "AI insights are available for Pro members" + upsell
  - If Pro: AI replies with mock response
- **Status**: ✅ / ❌

---

## PHASE 3: Mentors (6 steps)

### Step 8: Navigate to Mentors
- **Action**: Click "Mentors" in bottom nav
- **Expected**: MentorsScreen opens, shows list of mentors (at least 3-4 cards)
- **Status**: ✅ / ❌

### Step 9: Click a mentor card
- **Action**: Click any mentor (e.g., "Sarah Johnson")
- **Expected**: 
  - ✅ MentorProfileScreen opens (not blank page)
  - ✅ Shows mentor details: name, title, bio, session types
- **Status**: ✅ / ❌

### Step 10: Verify "Open Chat" button
- **Action**: Scroll to see the "Open Chat" button (blue border, above session types)
- **Expected**: ✅ Button is visible and clickable
- **Status**: ✅ / ❌

### Step 11: Click "Open Chat"
- **Action**: Click the button
- **Expected**: 
  - ✅ Navigates to `/chat/:conversationId`
  - ✅ Opens a chat thread with that mentor
  - ✅ Can send messages
- **Status**: ✅ / ❌

### Step 12: Test invalid mentor ID
- **Action**: Navigate to `/mentors/invalid-mentor-999`
- **Expected**: 
  - ✅ See "Mentor Not Found" screen (emoji, message, "Back to Mentors" button)
  - ✅ NOT a blank page or 404
- **Status**: ✅ / ❌

### Step 13: Click "Book" on a session type
- **Action**: Click "Book" button on any session
- **Expected**: ✅ Navigates to `/book/:mentorId` (booking flow starts)
- **Status**: ✅ / ❌

---

## PHASE 4: Natal Screen (5 steps)

### Step 14: Navigate to Natal
- **Action**: 
  - If you have birth data: Navigate to `/natal` (via Home or direct URL)
  - If no birth data: Add birth data in Settings first
- **Expected**: NatalScreen opens, shows 4 buttons: Astrology, Numerology, Meditation, Human Design
- **Status**: ✅ / ❌

### Step 15: Verify no natal wheel
- **Action**: Look for a large circular chart/wheel
- **Expected**: ✅ NO natal wheel visible (already removed per requirements)
- **Status**: ✅ / ❌

### Step 16: Click any disabled feature button
- **Action**: Click "Astrology" button (or any other button)
- **Expected**: 
  - ✅ Modal appears: "Feature Coming Soon"
  - ✅ "Find a Mentor" CTA visible
  - ✅ "Cancel" button visible
  - ✅ NOT a 404 or blank page
- **Status**: ✅ / ❌

### Step 17: Click "Find a Mentor" in modal
- **Action**: Click the button
- **Expected**: 
  - ✅ Modal closes
  - ✅ Navigates to `/mentors`
- **Status**: ✅ / ❌

### Step 18: Go back to Natal, click button, then "Cancel"
- **Action**: Back to `/natal`, click any button, then click "Cancel"
- **Expected**: 
  - ✅ Modal closes
  - ✅ Stays on Natal screen (no navigation)
- **Status**: ✅ / ❌

---

## Acceptance Criteria (All must pass)

- [ ] **Messages**: Send works immediately, persists after reload, invalid ID handled gracefully
- [ ] **Mentors**: All cards open valid profiles, "Open Chat" works, "Mentor Not Found" screen for invalid IDs
- [ ] **Natal**: No wheel, 4 buttons show modal (not 404), modal CTAs work
- [ ] **No console errors** during test
- [ ] **No blank pages** or infinite loading states
- [ ] **No 404 for disabled features** (show modal or redirect instead)

---

## Notes
- Test conducted on: ___________
- Tester: ___________
- All steps passed: YES / NO
- Blockers found: ___________
