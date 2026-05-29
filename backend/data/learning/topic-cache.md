---
description: Why you changed it but can't see the change
estimated_minutes: 5
generated: false
id: topic-cache
learning_objective: Explain caching and why stale data appears even after updates
module_id: module-error
sort_order: 6
title: Cache
---

## Cache — "It's fixed but I still see the old version"

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