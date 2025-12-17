# Smoke Test P0 Fix - Stabilization

## Messages
1. [ ] **Navigate to Messages**: Click "Messages" tab.
2. [ ] **Start Chat**: Click "+" or select an existing conversation.
3. [ ] **Send Message**: Type "Hello" and hit Send.
   - [ ] Verify message appears immediately at the bottom.
   - [ ] Verify input clears.
4. [ ] **Persistence**: Refresh the page.
   - [ ] Verify "Hello" message is still there.
5. [ ] **Pro Gating (Non-Pro)**:
   - [ ] Ensure user is NOT Pro (check Profile or use new user).
   - [ ] Send a message.
   - [ ] Verify input becomes locked/disabled or a "Limit Reached" / "Upgrade" message appears.
   - [ ] Verify NO assistant reply appears after 5 seconds.
6. [ ] **Pro Gating (Pro)**:
   - [ ] Upgrade to Pro (via Mock or Settings).
   - [ ] Send a message "Tell me about my chart".
   - [ ] Verify message sends.
   - [ ] Verify "Assistant" is typing (optional) or replies within ~2-3 seconds with a mock response.

## Community
7. [ ] **Navigate to Community**: Click "Community" tab.
8. [ ] **Create Post**: Click "+" FAB.
   - [ ] Type "Test post #smoke".
   - [ ] Click Post.
   - [ ] Verify post appears at top of "Latest" feed.
9. [ ] **Like**: Click Heart icon on the new post.
   - [ ] Verify count increments.
   - [ ] Refresh page.
   - [ ] Verify Heart is still red and count persists.
10. [ ] **Share**: Click Share icon.
    - [ ] Verify "Post link copied" alert/toast appears.
11. [ ] **Comment**: Click Message/Comment icon (leads to Detail).
    - [ ] Add comment "Test comment".
    - [ ] Verify comment appears in list.
    - [ ] Refresh page.
    - [ ] Verify comment persists.

## Members / Pro
12. [ ] **Navigate to Members (Pro)**: Click "Pro" or "Upgrade" CTA.
13. [ ] **Verify Cards**: See "Monthly" and "Yearly" options.
14. [ ] **Click Flow**: Click "Upgrade - Monthly".
    - [ ] Verify navigation to `/payment`.
    - [ ] Verify URL params contain amount and plan.

## Navigation Sanity
15. [ ] **Walkthrough**:
    - [ ] Home -> Click "Daily Horoscope" (or similar) -> Leads to screen.
    - [ ] Mentors -> Click a mentor -> Leads to Profile.
    - [ ] Profile -> Click "Settings" -> Leads to Settings.
    - [ ] No 404s or Dead Ends encountered.
