---
description: Turning features on and off without deploying
estimated_minutes: 4
generated: false
id: topic-feature-flag
learning_objective: Explain feature flags and how they enable safe rollouts and A/B
  testing
module_id: module-deploy
sort_order: 4
title: Feature Flag
---

## Feature Flag

A **Feature Flag** (also called a Feature Toggle) lets you **turn a feature on or off without redeploying code**.

```
┌─────────────────────────────────────────────────────────┐
│              FEATURE FLAG DASHBOARD                     │
│                                                         │
│  Feature                   Status      % of Users       │
│  ──────────────────────────────────────────────────     │
│  new_checkout_flow          ● ON        100%            │
│  ai_recommendation          ● ON         10%  ← Beta    │
│  dark_mode                  ○ OFF          0%           │
│  loyalty_points             ● ON         50%  ← A/B     │
└─────────────────────────────────────────────────────────┘
```

### Use cases for Feature Flags:

```
1. GRADUAL ROLLOUT
   ─────────────────────────────────────
   Week 1: Enable for 5% of users → monitor for errors
   Week 2: 25% → still stable?
   Week 3: 100% → full release ✅

2. A/B TESTING
   ─────────────────────────────────────
   50% of users → Version A (old checkout)
   50% of users → Version B (new checkout)
   Measure which one has a higher conversion rate

3. KILL SWITCH (Emergency off)
   ─────────────────────────────────────
   Critical bug detected in a new feature?
   → Turn it OFF instantly — no deploy, no rollback needed

4. PERMISSION-BASED RELEASE
   ─────────────────────────────────────
   Internal users / beta testers: ON
   Regular users: OFF (until fully ready)
```

> 🔑 **BA should propose a Feature Flag when:**
> - The feature is large or high-risk
> - You need A/B testing
> - The feature depends on an unfinished data migration
> - A phased rollout is planned