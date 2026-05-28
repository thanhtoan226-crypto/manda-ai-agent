# 🔌 Module 2: API — The Bridge Between Systems

> **Goal:** After this module, you can read API docs, write integration specs, and hold confident conversations with developers about APIs.

---

## 2.1 What is a REST API?

**API** (Application Programming Interface) is a **communication contract** between software systems. Think of it like ordering food at a restaurant through a menu — the API *is* that menu.

**REST API** is the most common style of API, using HTTP (the same protocol as the web) to send and receive data.

```
┌────────────────────────────────────────────────────┐
│           REST API = Restaurant Menu               │
│                                                    │
│  GET    /orders       → List all orders            │
│  GET    /orders/123   → Get order #123             │
│  POST   /orders       → Create a new order         │
│  PUT    /orders/123   → Update order #123          │
│  DELETE /orders/123   → Delete order #123          │
└────────────────────────────────────────────────────┘
```

---

## 2.2 Endpoint / HTTP Method

### 📍 What is an Endpoint?
An endpoint = the **specific address** of one feature in an API.

Example: `https://api.shopvn.com/v1/orders/456`
- `https://api.shopvn.com` → server domain
- `/v1/orders/456` → endpoint (order #456, version 1)

---

### 🔧 HTTP Methods — The 4 core actions

```
┌──────────┬───────────────────┬──────────────────────────────────┐
│ Method   │ Action            │ Business example                 │
├──────────┼───────────────────┼──────────────────────────────────┤
│ GET      │ Read / Fetch data │ View customer list, look up order│
│ POST     │ Create new        │ Place order, register account    │
│ PUT      │ Full update       │ Replace entire profile           │
│ PATCH    │ Partial update    │ Change only the order status     │
│ DELETE   │ Remove            │ Cancel order, delete product     │
└──────────┴───────────────────┴──────────────────────────────────┘
```

> 🔑 **GET never changes data.** Calling it 100 times returns the same result (unless someone else made a change in between).

---

## 2.3 Header – Body – Param

Every API request has three parts that carry information:

```
┌─────────────────────────────────────────────────────┐
│                    API REQUEST                      │
│                                                     │
│  📋 HEADER (Meta information)                       │
│  ├── Authorization: Bearer eyJhbGc...               │
│  ├── Content-Type: application/json                 │
│  └── X-Request-ID: abc-123                          │
│                                                     │
│  🌐 URL + PARAMS (Address + filters)                │
│  └── GET /orders?status=pending&page=1&limit=20     │
│                   └──────────────── Query Params    │
│                                                     │
│  📦 BODY (Payload — only for POST/PUT/PATCH)        │
│  └── { "productId": 5, "quantity": 2 }              │
└─────────────────────────────────────────────────────┘
```

### Types of parameters:

| Type | Where it lives | When to use | Example |
|------|---------------|-------------|---------|
| **Path Param** | Inside the URL | Identify one specific object | `/orders/123` (123 is the ID) |
| **Query Param** | After `?` | Filter, search, paginate | `?status=paid&page=2` |
| **Body** | Request body | Send data to create/update | `{ "name": "John Doe" }` |
| **Header** | Request header | Auth tokens, metadata | `Authorization: Bearer token...` |

---

## 2.4 JSON Structure — What BAs Need to Read

JSON (JavaScript Object Notation) is the most common data format used in APIs.

### Real example: Response for fetching an order

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2024-001",
    "status": "confirmed",
    "customer": {
      "id": 456,
      "name": "John Smith",
      "email": "john@email.com"
    },
    "items": [
      {
        "productId": 10,
        "name": "Latte",
        "quantity": 2,
        "price": 5.50
      },
      {
        "productId": 15,
        "name": "Croissant",
        "quantity": 1,
        "price": 3.00
      }
    ],
    "totalAmount": 14.00,
    "createdAt": "2024-01-15T08:30:00Z"
  },
  "errors": null
}
```

### BA checklist when reviewing JSON with dev:

```
📌 Questions to ask when reviewing an API response:

□ "success": true/false → What does the flow look like when false?
□ Which fields are required vs optional?
□ What enum values does "status" support? (confirmed, pending, cancelled...)
□ Timestamps: which timezone? (UTC +0 or local?)
□ Money: what currency/unit? (Is it in cents or dollars?)
□ "errors": when there's an error, what does the error format look like?
```

---

## 2.5 Webhook vs Polling

Two ways to receive information when an event occurs.

### 🔄 Polling — "Keep asking until something changes"

```
Client                          Server
  │                               │
  │──── "Anything new?" ─────────►│
  │◄─── "Nothing yet"             │
  │     (5 seconds later)         │
  │──── "Anything new?" ─────────►│
  │◄─── "Nothing yet"             │
  │     (5 seconds later)         │
  │──── "Anything new?" ─────────►│
  │◄─── "Yes! Order #123 confirmed"│
```

**Like:** Manually refreshing your inbox to check for new email.

**Downside:** Wastes resources, not real-time.

---

### 🪝 Webhook — "We'll call you when something happens"

```
Client                          Server
  │                               │
  │─── Register: "When there's   ►│
  │    a new order, call this URL"│
  │                               │
  │                    (10 minutes later)
  │                               │ ← New order created!
  │◄─── POST /my-webhook-url ─────│
  │     { "event": "order.created", "orderId": 456 }
```

**Like:** Subscribing to email notifications when new mail arrives.

**Advantage:** Near real-time, resource efficient.

| | Polling | Webhook |
|--|---------|---------|
| **Who initiates** | Client asks repeatedly | Server calls back on event |
| **Latency** | Depends on interval | Near real-time |
| **Resource cost** | High | Low |
| **Use when** | Server doesn't support webhooks | 3rd-party integrations (Stripe, PayPal) |

> 🔑 **Ask the team:** *"When a third party updates a status (e.g., payment completed), do they use webhooks or do we need to poll?"*

---

## 2.6 Authentication vs Authorization

These are **two different concepts** that are often confused:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🔑 AUTHENTICATION (Identity check)                 │
│     "Who are you?"                                  │
│     → Login with email/password                     │
│     → Result: System knows which user you are       │
│                                                     │
│  🔒 AUTHORIZATION (Permission check)                │
│     "What are you allowed to do?"                  │
│     → Check role/permission                         │
│     → Result: Allow or deny the action             │
└─────────────────────────────────────────────────────┘
```

**Real-world examples:**

| Scenario | Authentication | Authorization |
|----------|----------------|---------------|
| Employee scans badge at office | ✅ Badge is valid (we know who) | Which floors can they access? |
| User logs into the app | ✅ Correct password | Can they view financial reports? |
| API receives a token | ✅ Token is valid | Are they allowed to call the delete endpoint? |

---

## 2.7 Token / JWT Basics

### 🎫 What is a Token?

A token is an **access pass** the server issues after a successful login.

```
1. Login                  2. Receive Token          3. Use Token

User: email + pass  ──►  Server validates  ──►  Token: "eyJhbGc..."
                               │                        │
                          Issues token             Attach to Header
                               │                   of every request
                          User stores token              │
                                                   Server trusts it
```

### 🔐 JWT (JSON Web Token)

JWT is the most common token format, made of 3 parts separated by `.`:

```
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOjEyM30  .  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV
│                         │                        │
└── Header                └── Payload              └── Signature
    (token type,               (data: userId,          (tamper-proof seal)
     algorithm)                 role, expiry time)
```

**Payload typically contains:**
```json
{
  "userId": 123,
  "email": "user@email.com",
  "role": "admin",
  "exp": 1705276800   ← When the token expires (Unix timestamp)
}
```

> 🔑 **Ask the team:**
> - *How long does a token last? (15 min? 1 day? 30 days?)*
> - *After a password change, are old tokens invalidated?*
> - *How does the refresh token flow work?*

---

## 📌 Module 2 Summary

| Concept | One-line reminder |
|---------|-------------------|
| API | Restaurant menu — lists what the system can do |
| GET / POST / PUT / DELETE | Read / Create / Update / Delete |
| Header | Meta info (who's calling, data type) |
| Body | Payload sent up (POST/PUT/PATCH only) |
| Query Param | Filter data in the URL `?key=value` |
| JSON | Data format using `{ key: value }` pairs |
| Polling | Client keeps asking on a timer |
| Webhook | Server calls back when an event fires |
| Authentication | Identity check — **Who are you?** |
| Authorization | Permission check — **What can you do?** |
| JWT Token | Time-limited access pass containing user info |
