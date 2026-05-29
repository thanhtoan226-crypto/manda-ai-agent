---
description: When to wait and when to move on
estimated_minutes: 5
generated: false
id: topic-sync-async
learning_objective: Distinguish synchronous and asynchronous flows with business examples
module_id: module-system
sort_order: 5
title: Sync vs Async Communication
---

## Sync vs Async Flow

### ⏱️ Synchronous — "Wait for the result right now"

```
User ──► [System] ──► Process ──► Return result ──► User
         (user waits)              (user receives immediately)

Timeline: |──────────────────────────────────────|
          Send                                 Receive
```

**Examples:** Exchange rate lookup, login, product search.

---

### 📬 Asynchronous — "Send it and keep going"

```
User ──► [System] ──► "Received, processing..." ──► User continues using app
                              │
                              ▼ (seconds or minutes later)
                         Processing complete
                              │
                              ▼
                    Push notification to User
```

**Examples:** Flight booking, exporting large reports, bulk email sends.

> 🔑 **BA needs to determine:** Does the user need the result **immediately**? If not → Async is often the better fit.