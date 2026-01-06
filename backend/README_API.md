Backend API Documentation
Women Safety Application

Base URL
http://localhost:5000

USER ROUTES
Base Path: /api/user

Register / Login User
Create a new user or retrieve an existing one (Google Auth flow).

Endpoint
POST /api/user/user

Authentication
Required (Bearer Token)

Request Body

{
  "fcmToken": "string (optional)",
  "phone": "string (optional)"
}


Response

{
  "success": true,
  "userdetails": {
    "name": "Jane Doe",
    "photo": "https://...",
    "phone": "+1234567890",
    "uid": "65fa..."
  }
}


Add Friends (By ID)
Add friends using their MongoDB ObjectIds.

Endpoint
POST /api/user/friends

Authentication
Required

Request Body

{
  "friends": ["65fa1...", "65fa2..."]
}


Response

{
  "message": "Friends added successfully",
  "addedFriends": ["65fa1..."],
  "notAddedFriends": []
}


Add Friends (By Phone)
Add friends using their phone numbers.

Endpoint
POST /api/user/friends/phone

Authentication
Required

Request Body

{
  "phones": ["1234567890", "9876543210"]
}


Response

{
  "message": "Friends added successfully",
  "addedFriendsCount": 1,
  "notRegisteredPhones": ["9876543210"]
}


Edit Profile
Update user profile details.

Endpoint
PATCH /api/user/profile

Authentication
Required

Request Body (any combination)

{
  "name": "New Name",
  "photo": "New Photo URL",
  "phone": "New Phone",
  "provider": "google"
}


Response

{
  "message": "Profile updated successfully",
  "user": {}
}


Submit Report
Create a safety report in case of emergency or risk.

Endpoint
POST /api/user/report

Authentication
Required

Request Body

{
  "whatHappened": "Description of event",
  "firstName": "Jane",
  "lastName": "Doe",
  "riskVal": "Minor concern",
  "lng": 77.12345,
  "lat": 28.56789,
  "phone": "1234567890"
}


Response

{
  "success": true,
  "message": "Report created"
}


Get Safety Score
Calculate the safety score of a location based on nearby reports.

Endpoint
GET /api/user/safeScore

Authentication
Required

Query Parameters
lng: Longitude
lat: Latitude

Response

{
  "safescore": 85.5,
  "totalCases": 3,
  "data": []
}


POLICE STATION ROUTES
Base Path: /api/police

Register Device
Initiate registration for a police station device. Sends verification code to email.

Endpoint
POST /api/police/policeDeviceReg

Request Body

{
  "fcmToken": "token123...",
  "emailId": "station@police.gov",
  "DeviceId": "device_unique_id"
}


Response

{
  "success": true,
  "message": "Mail sent",
  "deviceId": "65fb..."
}


Verify Device
Verify the email code to complete device registration.

Endpoint
POST /api/police/verifyDevice

Request Body

{
  "code": 1234,
  "emailId": "station@police.gov",
  "DeviceId": "device_unique_id",
  "fcmToken": "token123..."
}


Response

{
  "success": true,
  "message": "Police device registered",
  "policeStationId": "station_001"
}


CHATBOT ROUTES
Base Path: /api/chat

Chat with AI
Interact with the Women Safety Assistant AI.

Endpoint
POST /api/chat

Rate Limit
5 requests per 30 seconds

Request Body

{
  "userId": "user_123",
  "message": "Is it safe to walk in Central Park at night?"
}


Response

{
  "reply": "It is generally advisable to...",
  "history": []
}