---
description: Automatically trying again — and when it's dangerous
estimated_minutes: 4
generated: false
id: topic-retry-logic
learning_objective: Explain retry patterns, exponential backoff, and the idempotency
  risk
module_id: module-error
sort_order: 5
title: Retry Logic
---

## Retry Logic

**Retry** is the mechanism that **automatically tries again** when a request fails.

```
Request attempt 1 ──► ❌ Failed (timeout)
                              │ wait 1s
Request attempt 2 ──► ❌ Failed (server busy)
                              │ wait 2s
Request attempt 3 ──► ✅ Success!
```

### Exponential Backoff — The smart retry strategy:

```
Retry attempt:   1      2      3      4      5
Wait time:       1s  →  2s  →  4s  →  8s  →  16s  →  Give up

(Each wait doubles — avoids hammering an already overloaded server)
```

### ⚠️ Idempotency — The BA risk to know about

**Idempotent** = Calling it once or 100 times produces the same result.

```
✅ Idempotent (safe to retry):
   GET /orders/123 → Called 5 times, still returns the same 1 order

❌ Non-idempotent (DANGEROUS to retry):
   POST /payments → Called 3 times = charged 3 times! 💸
```

> 🔑 **BA must ask:** *For critical actions (create order, process payment), what prevents duplicates during a retry? Is there an idempotency key mechanism?*