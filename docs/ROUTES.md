
# Routes

## Public
- `/auth`: Login/Signup
- `/onboarding`: Birth profile setup

## Protected (Seeker & All)
- `/home`: Dashboard
- `/mentors`: List of mentors
- `/mentors/:id`: Mentor profile
- `/natal`: Natal chart
- `/astrology`: Placeholder
- `/human-design`: Placeholder
- `/community`: Feed
- `/community/new`: Create post
- `/post/:id`: Post details
- `/chat`: Chat list
- `/chat/:id`: Chat thread
- `/profile`: User profile
- `/settings`: App settings
- `/courses`: Course list
- `/courses/:id`: Course details

## Booking Flow
- `/book/:mentorId`: Select time
- `/book/confirm/:mentorId`: Confirm & Pay
- `/booking/:id`: Booking details
- `/sessions/:sessionId`: Video room

## Mentor Only
- `/mentor`: Dashboard
- `/mentor/availability`: Schedule
- `/mentor/bookings`: Upcoming sessions

## Admin Only
- `/admin`: Admin dashboard
