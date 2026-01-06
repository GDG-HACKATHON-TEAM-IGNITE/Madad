# Frontend API JSON Expectations

This document outlines the JSON payloads sent and expected by the frontend application.

## 1. Profile Update
**Endpoint:** `PATCH /api/profile`
**Component:** `src/components/Settings.jsx`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <Firebase_ID_Token>`

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

**Response (Expected):**
- **Success (200 OK):**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "uid": "firebase_uid",
      "fullName": "User Name",
      "email": "user@example.com"
    }
  }
  ```
- **Error (4xx/5xx):**
  ```json
  {
    "error": "Error message description"
  }
  ```

---

## 2. Emergency Contacts (Friends) Update
**Endpoint:** `PATCH /api/user/addfriends`
**Component:** `src/components/Settings.jsx`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <Firebase_ID_Token>`

**Request Body:**
```json
{
  "friends": [
    "MONGOOSE_ID_1",
    "MONGOOSE_ID_2"
  ]
}
```

**Note:** Frontend sends Mongoose ObjectIDs (24-character hex strings), not Firebase UIDs.

**Response (Expected):**
- **Success (200 OK):**
  ```json
  {
    "message": "Contacts updated successfully"
  }
  ```

---

## 3. Incident Reporting
**Endpoint:** `POST /api/report`
**Component:** `src/components/Reports.jsx`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <Firebase_ID_Token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "description": "Description of the incident...",
  "whatHappened": 1, // Integer ID: 1=Harassment, 2=Theft, etc.
  "riskVal": 2,      // Integer ID: 1=Minor, 2=Moderate, 3=Danger
  "lng": 77.1234,    // Longitude
  "lat": 28.1234,    // Latitude
  "location": {
    "type": "Point",
    "coordinates": [
      77.1234, // Longitude
      28.1234  // Latitude
    ],
    "address": "123 Street Name, City, Country"
  }
}
```

**Response (Expected):**
- **Success (200/201 OK):**
  ```json
  {
    "message": "Report submitted successfully",
    "reportId": "generated_db_id"
  }
  ```
