---
description: When the system has waited too long and gives up
estimated_minutes: 4
generated: false
id: topic-timeout
learning_objective: Explain timeout concepts and the business risk of timeout vs actual
  failure
module_id: module-error
sort_order: 4
title: Timeout
---

## Timeout

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