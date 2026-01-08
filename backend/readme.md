Police Dashboard Integration & Improved Authentication
This update focuses on tightening authentication flows and introducing a fully functional police dashboard, with several backend fixes and frontend enhancements to support smoother real-time tracking and auto-login.
Backend Improvements
Fixed the addFriends logic to properly handle Mongoose ObjectIds.
Added new /api/profile GET and PATCH routes for viewing and updating user profiles.
Improved userCreate so existing user data is preserved during login instead of being
overwritten.
Optimized police device registration to avoid duplicate device entries.
Added /api/police/checkDevice to support automatic login for verified police devices.
Updated the Device schema to allow verification fields to be cleared once verification succeeds.
Enhanced verification APIs to return police station coordinates for map usage.
Frontend Enhancements
Updated FriendMap with improved socket handling and automatic map centering.
Refactored the Sign-in page to clearly separate Civilian and Police login flows.
Added a new Police Sign-in component with device-based authentication (Email + OTP).
Implemented auto-login for verified police devices.
Built a live Police Dashboard to track users in real time.
Added a dedicated /police-dashboard route with proper redirect logic.
Configured the dashboard map to automatically zoom to the logged-in station’s location.
