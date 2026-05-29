---
description: Controlling what values are allowed
estimated_minutes: 3
generated: false
id: topic-enum-status
learning_objective: Define an enum for a status field and explain why constrained
  values matter
module_id: module-data
sort_order: 3
title: Enum & Status
---

## Enum / Status

**Enum** is a set of **predefined allowed values** — a field can only hold one of those values.

### Example: Order status flow

```
                      ORDER STATUS STATE MACHINE

        ┌──────────┐
  ───►  │ PENDING  │  (Created, awaiting processing)
        └────┬─────┘
             │ Confirmed
             ▼
        ┌──────────┐           ┌───────────┐
        │CONFIRMED │           │ CANCELLED │
        └────┬─────┘           └───────────┘
             │ Shipped               ▲
             ▼                       │ Cancel before shipping
        ┌──────────┐                 │
        │ SHIPPING │─────────────────┘
        └────┬─────┘
             │ Delivered
             ▼
        ┌──────────┐
        │DELIVERED │
        └──────────┘
```

### Why Enums matter for BAs:

- Enforces **data integrity** — no one can enter random values
- Defines **business rules**: from state A, which states are allowed?
- Prevents bugs like: dev stores `"Confirmed"`, BA queries `"confirmed"`, report filters `"CONFIRMED"` → none match!

> 🔑 **BA action:** For any spec involving status/state, draw a state diagram and define the exact enum values — agree on **consistent casing** (all lowercase or all uppercase).