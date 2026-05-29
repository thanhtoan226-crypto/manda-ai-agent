---
description: How software tracks changes across releases
estimated_minutes: 4
generated: false
id: topic-versioning
learning_objective: Explain semantic versioning and what each version bump means for
  testing
module_id: module-deploy
sort_order: 3
title: Versioning
---

## Versioning

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