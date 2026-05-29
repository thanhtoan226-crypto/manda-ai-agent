---
description: When things go wrong, go back
estimated_minutes: 4
generated: false
id: topic-rollback
learning_objective: Describe rollback strategies and why BAs should plan for rollback
  in release criteria
module_id: module-deploy
sort_order: 5
title: Rollback
---

## Rollback

**Rollback** means reverting to a previous version when the new one causes problems.

```
DEPLOY + ROLLBACK TIMELINE

10:00 AM  Deploy v2.1.0 to Production
          │
10:15 AM  Monitoring: error rate spikes from 0.1% → 5%
          │
10:20 AM  Decision: rollback
          │
10:22 AM  Rollback to v2.0.9 ← Automatic or manual
          │
10:23 AM  Error rate returns to 0.1% ✅
          │
10:30 AM  Post-mortem: investigate root cause in v2.1.0
```

### Blue-Green Deployment — The most common rollback-friendly strategy:

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼────────┐         ┌──────────▼───────┐
    │   🟦 BLUE        │         │   🟩 GREEN        │
    │   (v2.0.9 old)   │         │   (v2.1.0 new)   │
    │   Currently live │         │   Just deployed  │
    └──────────────────┘         └──────────────────┘

Step 1: Deploy v2.1.0 to GREEN (BLUE still serving all traffic)
Step 2: Test GREEN thoroughly
Step 3: Switch traffic to GREEN
Step 4: Problem detected → switch traffic back to BLUE instantly!
```

### Rollback vs Hotfix:

| | Rollback | Hotfix |
|--|---------|--------|
| **What it is** | Revert to previous code version | Patch the bug directly in the new version |
| **Time needed** | Minutes | Hours to days |
| **Risk** | Lose new features | May introduce new bugs |
| **Use when** | Severe bug, no quick fix obvious | Small, clear fix available |

> 🔑 **BA should ask before every major release:**
> - *What is the rollback plan if something goes wrong?*
> - *How long does a rollback take?*
> - *Can data migrations be rolled back, or is it one-way?*