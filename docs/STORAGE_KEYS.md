
# Storage Keys Registry

All data is persisted in `localStorage` using versioned keys to allow for future migrations.

| Key | Description | Type/Shape |
| :--- | :--- | :--- |
| `mhs_storage_version` | Schema version | `number` |
| `mhs_user_v1` | Current user session | `User` |
| `mhs_users_db_v1` | All registered users | `User[]` |
| `mhs_birth_profile_v1` | Current user's birth data | `BirthProfile` |
| `mhs_theme_mode` | Theme preference | `'light' | 'dark' | 'system'` |
| `mhs_lang_v1` | Language preference | `'en' | 'ru' ...` |
| `mhs_bookings_v1` | All bookings | `Booking[]` |
| `mhs_mentor_profiles_v1` | Mentor details | `MentorProfile[]` |
| `mhs_posts_v1` | Community posts | `CommunityPost[]` |
| `mhs_comments_v1` | Post comments | `Comment[]` |
| `mhs_post_likes_v1` | Likes map | `Record<postId, userId[]>` |
| `mhs_conversations_v1` | Chat threads | `Conversation[]` |
| `mhs_messages_v1` | Chat messages | `Message[]` |
| `mhs_courses_v1` | Course content (cache/seed) | `Course[]` |
| `mhs_courses_progress_v1` | User course progress | `CourseProgress[]` |
| `mhs_video_sessions_v1` | Jitsi sessions | `VideoSession[]` |
| `mhs_payments_v1` | Payment records | `PaymentRecord[]` |
| `mhs_subscription_v1` | Pro status | `SubscriptionRecord[]` |
| `mhs_notifications_v1` | User alerts | `NotificationItem[]` |
| `mhs_feature_flags_v1` | Local flag overrides | `Record<string, boolean>` |
| `mhs_ai_usage_v1` | Daily AI usage stats | `Record<date, Record<userId, count>>` |
| `mhs_blueprint_v1` | Cached HD/Astro snapshot | `BlueprintSnapshot` |
