---
description: Tracking a single request across the entire system
estimated_minutes: 3
generated: false
id: topic-trace-id
learning_objective: Explain how Trace IDs connect logs across services and why they
  speed up debugging
module_id: module-error
sort_order: 3
title: Trace ID
---

## Trace ID

A **Trace ID** is a unique identifier that follows **a single request across the entire system**.

### Why Trace IDs matter:

```
User clicks "Place Order"
        │
        │  Request carries Trace ID: "abc-123-xyz"
        ▼
   [API Gateway]       → log: "abc-123-xyz: Received order request"
        │
        ▼
   [Order Service]     → log: "abc-123-xyz: Creating order for user 456"
        │
        ▼
   [Inventory Service] → log: "abc-123-xyz: Checking stock for product 10"
        │
        ▼
   [Payment Service]   → log: "abc-123-xyz: Processing payment $95.00"
        │
        ▼ ❌ TIMEOUT!
   [Email Service]     → log: "abc-123-xyz: ERROR - Connection timeout"
```

Without a Trace ID, a developer has to scan **millions of log lines** to find the problem.

With a Trace ID: `grep "abc-123-xyz" all_logs.txt` → instantly shows the full journey!

> 🔑 **BA recommendation:** Propose in your spec that when an error occurs, the **app displays the Trace ID** to the user — it dramatically speeds up support investigations.