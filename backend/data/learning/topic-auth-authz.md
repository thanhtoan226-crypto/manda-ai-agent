---
description: Who you are vs what you can do
estimated_minutes: 4
generated: false
id: topic-auth-authz
learning_objective: Distinguish authentication and authorization with access control
  examples
module_id: module-api
sort_order: 6
title: Authentication vs Authorization
---

## Authentication vs Authorization

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