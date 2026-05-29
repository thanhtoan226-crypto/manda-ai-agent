---
description: The system diary that records everything that happens
estimated_minutes: 4
generated: false
id: topic-logs
learning_objective: Explain what logs are, read log levels, and know what information
  to provide when reporting a bug
module_id: module-error
sort_order: 2
title: Logs
---

## What is a Log?

A **log** is a detailed diary recording **everything that happens** inside a system.

### Example of real log output:

```
2024-01-15 14:32:01 [INFO]  [trace:abc123] User 456 requested GET /orders
2024-01-15 14:32:01 [INFO]  [trace:abc123] DB query: SELECT * FROM orders WHERE user_id=456
2024-01-15 14:32:02 [INFO]  [trace:abc123] Returned 5 orders, 200 OK
2024-01-15 14:32:45 [WARN]  [trace:def456] Payment gateway timeout after 3000ms
2024-01-15 14:32:45 [ERROR] [trace:def456] Order 789 failed: Payment service unreachable
2024-01-15 14:32:45 [ERROR] [trace:def456] Stack trace: ConnectionError at PaymentService.charge()
```

### Log severity levels:

```
DEBUG   → Verbose technical detail (used while debugging)
INFO    → Normal operations ("User A logged in")
WARN    → Something unusual but not yet broken ("Retry attempt 2")
ERROR   → Something failed and needs attention
FATAL   → Critical failure, system may crash
```

> 🔑 **When reporting a bug, always give the dev:**
> 1. **Exact time** of the error (hour, minute, second — the more precise, the better)
> 2. **Trace ID** (if the app displays one)
> 3. **Steps to reproduce** the issue
> 4. **Screenshot** of the error screen