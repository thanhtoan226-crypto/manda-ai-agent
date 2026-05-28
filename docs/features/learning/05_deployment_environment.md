# 🚀 Module 5: Deployment & Environment

> **Goal:** Understand where a system sits in its lifecycle, know where to test, and know when a feature is truly live.

---

## 5.1 Dev / UAT / Staging / Production

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

---

## 5.2 Build vs Deploy

Two terms that are often used interchangeably — but they mean different things:

```
SOURCE CODE               BUILD                    DEPLOY
(Dev writes it)           (Package it)             (Run it on a server)

.js .ts .py   ──────►   app.bundle.zip  ──────►   Server running
.html .css               (Artifact)                app v2.1.0

Analogy:
Raw ingredients ──────►  Packaged product ──────►  On the store shelf
```

### A simple CI/CD pipeline:

```
Dev pushes code
      │
      ▼
  [CI Pipeline] ← "Continuous Integration"
  • Run unit tests
  • Check code quality
  • BUILD artifact
      │
      ├── ❌ Tests fail → Notify dev, STOP here
      │
      ▼ ✅ Tests pass
  [CD Pipeline] ← "Continuous Deployment/Delivery"
  • Deploy to Staging
  • Run integration tests
      │
      ▼
  [Manual Approval] ← BA / PO signs off
      │
      ▼
  Deploy to Production 🎉
```

> 🔑 **BA needs to know:** When you say *"deploy to UAT"*, it means the pre-built artifact is now running on the UAT server. You don't need to understand the build internals — but you should know: *after sign-off, how long until the feature is live in Production?*

---

## 5.3 Versioning

**Versioning** is how software tracks changes across releases so everyone knows what changed and when.

### Semantic Versioning (SemVer) — The most common standard:

```
        MAJOR . MINOR . PATCH
          2   .   1   .   3
          │         │       │
          │         │       └── Bug fix — no new features
          │         └── New feature — backward compatible
          └── Breaking change — may not be compatible with older clients
```

### What each version bump means for BAs:

| Version change | What changed | BA action |
|---------------|-------------|-----------|
| `2.1.3 → 2.1.4` | Patch: bug fix | Retest the affected flow |
| `2.1.3 → 2.2.0` | Minor: new feature added | Test new feature + regression check |
| `2.1.3 → 3.0.0` | Major: breaking change | **Caution!** All clients may be impacted |

### API Versioning:

```
https://api.service.com/v1/orders  ← Old version (still running)
https://api.service.com/v2/orders  ← New version (new structure)

When there's a breaking change, v1 is NOT removed immediately —
existing clients are given time to migrate to v2.
```

---

## 5.4 Feature Flag

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

---

## 5.5 Rollback

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

---

## 📌 Module 5 Summary

| Concept | One-line reminder |
|---------|-------------------|
| DEV | Dev's sandbox — don't do business testing here |
| UAT | BA's environment — run all business acceptance tests here |
| Staging | Production clone — final gate before go-live |
| Production | Real system — treat every action with care |
| Build | Package the code into a deployable artifact |
| Deploy | Run that artifact on a target environment |
| SemVer | MAJOR.MINOR.PATCH — read the version to gauge impact |
| Feature Flag | On/off switch — no deploy needed |
| Rollback | The "undo" button for Production |

---

## 🗺️ Full Feature Lifecycle (BA view)

```
BA writes spec
      │
      ▼
Dev codes on a feature branch
      │
      ▼
Code review + CI tests pass
      │
      ▼
Deploy to UAT
      │
      ▼
BA tests & signs off  ← THE MOST IMPORTANT STEP FOR BAS
      │
      ▼
Deploy to Staging
      │
      ▼
Performance test + final QA
      │
      ▼
Feature Flag: enable for 5% of users
      │
      ▼
Monitor for 24h → no issues
      │
      ▼
Feature Flag: enable for 100% ✅
      │
      ▼  (if issues arise at any point)
Rollback / Hotfix 🔄
```
