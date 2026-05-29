---
description: How systems remember who you are between requests
estimated_minutes: 5
generated: false
id: topic-token-jwt
learning_objective: Explain what a JWT token is and how it enables stateless authentication
module_id: module-api
sort_order: 7
title: Token & JWT
---

## Token / JWT Basics

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