---
description: The journey of code through environments
estimated_minutes: 5
generated: false
id: topic-dev-uat-prod
learning_objective: Name the standard environments and explain the purpose of each
  in the delivery pipeline
module_id: module-deploy
sort_order: 1
title: Dev / UAT / Staging / Production
---

## Dev / UAT / Staging / Production

Software doesn't go straight to real users — it travels through multiple **checkpoints**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    THE JOURNEY OF A FEATURE                          │
│                                                                      │
│  💻 DEV           🧪 UAT            🔬 STAGING       🌍 PRODUCTION  │
│  ──────────       ────────          ──────────       ────────────   │
│  Dev writes &     BA/QA test        Clone of Prod    Real users     │
│  tests locally    business logic    Performance test Real data      │
│                                                                      │
│  ──────────────────────────────────────────────────────────────►   │
│                       Stability increases →                         │
└──────────────────────────────────────────────────────────────────────┘
```

### Each environment explained:

| Environment | Purpose | Who uses it | Data | Stability |
|-------------|---------|-------------|------|-----------|
| **DEV** | Active development & experiments | Developers | Fake / mock data | Low — can be down anytime |
| **UAT** (User Acceptance Testing) | Business logic testing & sign-off | BA, PO, business users | Simulated real-like data | Medium |
| **STAGING** | Final check before release | Dev, QA | Clone of production | High — mirrors Production |
| **PRODUCTION** | Live system, real users | End users | Real data | Very high — downtime = lost revenue |

### Real scenario BAs encounter:

```
BA says: "I tested it on UAT and it passed — why is it broken in Production?"

Common causes:
• Different config between environments (API keys, endpoints)
• Missing data migration in Staging
• Production users have edge-case data not in UAT
• Feature Flag is ON in UAT but not yet ON in Production
```

> 🔑 **Golden rule:** **Never test directly on Production.** If you must verify something there, follow a clear procedure and always have a rollback plan ready.