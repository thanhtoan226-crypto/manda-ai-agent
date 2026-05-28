# 🐛 Module 4: Error & Debug Mindset

> **Goal:** When something breaks, you know what to ask, what information to provide, and what the dev team is actually doing.

---

## 4.1 HTTP Status Codes

Status codes are numbers the system returns to **communicate the outcome** of a request.

```
┌─────────────────────────────────────────────────────────────┐
│                  STATUS CODE CATEGORIES                     │
│                                                             │
│  2xx  ✅  Success                                           │
│  4xx  ❌  CLIENT error (wrong input, missing auth, etc.)    │
│  5xx  💥  SERVER error (dev/infra needs to investigate)     │
└─────────────────────────────────────────────────────────────┘
```

### The most important codes:

| Code | Name | Real meaning | Who acts? |
|------|------|--------------|-----------|
| **200** | OK | Success, data returned | — |
| **201** | Created | Successfully created | — |
| **204** | No Content | Success, no data (e.g., after delete) | — |
| **400** | Bad Request | Malformed request, missing field | BA reviews spec, FE fixes validation |
| **401** | Unauthorized | Not logged in / token expired | Redirect to login |
| **403** | Forbidden | Logged in but **no permission** | BA reviews role & permission spec |
| **404** | Not Found | Resource doesn't exist | BA checks endpoint spec |
| **409** | Conflict | Duplicate data (e.g., email already exists) | BA defines uniqueness rules |
| **422** | Unprocessable | Validation failed | BA reviews business rules |
| **500** | Server Error | Internal server failure | Dev checks logs |
| **502** | Bad Gateway | Downstream service not responding | DevOps / Infra |
| **503** | Service Unavailable | Server overloaded or in maintenance | DevOps / Infra |
| **504** | Gateway Timeout | Downstream service too slow | See Timeout section |

### Quick decision tree when you see an error:

```
Got an error?
      │
      ├── 4xx → Ask: "Was something wrong with the request?"
      │         • 401: Is the user logged in? Is the token expired?
      │         • 403: What role does the user have? What role is needed?
      │         • 404: Is the URL correct? Does the ID exist?
      │         • 400/422: Is the data sent in the correct format?
      │
      └── 5xx → Ask the dev: "What does the server log say?"
                • Provide: Trace ID + exact time the error occurred
```

---

## 4.2 What is a Log?

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

---

## 4.3 Trace ID

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

---

## 4.4 Timeout

**Timeout** is the maximum time a system will **wait for a response** before giving up and returning an error.

### Visual timeline:

```
User triggers a payment API call

Timeline:
0s ─────────────────────────────────────────────────► ?
│
│ App sends request ──► Payment Gateway
│                             │
│                      (processing...)
│                             │
│                      (still processing...)
│                             │
30s ── TIMEOUT! ──────────────X
│
└── App shows: "Payment could not be completed. Please try again."
    (But the payment gateway may have already charged the card!)
```

### The business problem with Timeout:

```
⚠️ IMPORTANT: "Timeout ≠ Failure"

Scenario: User clicks Pay → Timeout at 30s
  • Payment gateway: CHARGED the card  ✓
  • App: Shows "Payment failed"        ✗

→ User is charged but no order is created!
```

> 🔑 **BA must ask the tech team:**
> - *What is the timeout duration for each step in the flow?*
> - *When a timeout occurs, does the system rollback?*
> - *What is the reconciliation mechanism to catch "timed out but actually succeeded" cases?*

---

## 4.5 Retry Logic

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

---

## 4.6 Cache — "It's fixed but I still see the old version"

**Cache** is a temporary copy of data stored somewhere **faster to access** than the original source.

### Why cache exists:

```
WITHOUT CACHE:
User ──► App ──► Server ──► Database ──► Result
                                         (slow — DB hit on every request)

WITH CACHE:
User ──► App ──► Cache ──► Result   (fast — no DB call needed)
                  │
                  └── Cache "miss" → ask DB → store in cache → serve
```

### Example: Currency exchange rate

```
10:00 AM - Cache stores: USD = 1.08 EUR
10:01 AM - 1,000 users ask → all served from cache, DB untouched
10:30 AM - Real rate changes: USD = 1.09 EUR
10:30 AM - Admin updates DB → but cache has NOT refreshed yet!
10:45 AM - Cache expires (TTL = 45 min) → refreshes → now correct!
```

### Common reasons for "fixed but not showing yet":

```
┌──────────────────┬────────────────────────────────────────────┐
│ Cache location   │ Fix                                        │
├──────────────────┼────────────────────────────────────────────┤
│ Browser cache    │ Ctrl+Shift+R (hard reload), clear cache    │
│ CDN cache        │ Dev/Infra must manually purge the CDN      │
│ App server cache │ Dev must clear it or wait for TTL to expire│
│ Database cache   │ Less common — dev handles it               │
└──────────────────┴────────────────────────────────────────────┘
```

**TTL (Time-To-Live):** How long a cached value lives before it auto-refreshes.

> 🔑 **BA checklist before escalating "still not updated" to dev:**
> 1. Browser: tried Ctrl+Shift+R already?
> 2. Which environment? (Dev/UAT may have different cache configs than Prod)
> 3. If all else fails → ask dev to manually clear the cache

---

## 📌 Module 4 Summary

| Concept | One-line reminder |
|---------|-------------------|
| 2xx | Success |
| 4xx | **Input error** — client or spec needs a fix |
| 5xx | **Server error** — dev/infra to investigate |
| 401 vs 403 | Not logged in vs No permission |
| Log | System diary — the dev's detective tool |
| Trace ID | Barcode that tracks one request across all services |
| Timeout | Time's up — actual result is unknown |
| Retry | Auto-retry — be careful with payment-type actions |
| Cache | Fast copy — explains "I fixed it but don't see the change" |

### 🚑 Bug report template for BAs:

```
1. Time of error:      2024-01-15 at 14:32:45 UTC
2. Trace ID (if any):  abc-123-xyz
3. Environment:        Production / UAT
4. User / Account:     user_id = 456 or test email
5. Steps to reproduce: (1) Go to page X, (2) Do Y, (3) Error occurs
6. Screenshot + browser network tab (if available)
```
