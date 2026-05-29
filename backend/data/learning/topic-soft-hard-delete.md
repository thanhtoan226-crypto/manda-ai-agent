---
description: Why deleted data often isn't really gone
estimated_minutes: 4
generated: false
id: topic-soft-hard-delete
learning_objective: Compare soft and hard delete and explain when each is appropriate
module_id: module-data
sort_order: 4
title: Soft Delete vs Hard Delete
---

## Soft Delete vs Hard Delete

### 🗑️ Hard Delete — Permanently gone

```
BEFORE DELETE:                    AFTER DELETE:
┌────┬────────────┐               ┌────┬────────────┐
│ id │ name       │               │ id │ name       │
├────┼────────────┤  DELETE ──►   ├────┼────────────┤
│  1 │ Product A  │               │  1 │ Product A  │
│  2 │ Product B  │               └────┴────────────┘
│  3 │ Product C  │               (Product B is gone forever)
└────┴────────────┘
```

**Problem:** Old orders linked to Product B will **break** (null reference)!

---

### 🏷️ Soft Delete — Hidden, not gone

```
BEFORE "DELETE":                  AFTER "DELETE":
┌────┬────────────┬────────────┐  ┌────┬────────────┬────────────┐
│ id │ name       │ deleted_at │  │ id │ name       │ deleted_at │
├────┼────────────┼────────────┤  ├────┼────────────┼────────────┤
│  1 │ Product A  │ NULL       │  │  1 │ Product A  │ NULL       │
│  2 │ Product B  │ NULL       │► │  2 │ Product B  │ 2024-01-15 │ ← Hidden
│  3 │ Product C  │ NULL       │  │  3 │ Product C  │ NULL       │
└────┴────────────┴────────────┘  └────┴────────────┴────────────┘

Query: WHERE deleted_at IS NULL  → only sees A and C
Data still exists in DB — old orders still reference it safely!
```

| | Hard Delete | Soft Delete |
|--|-------------|-------------|
| **Data** | Gone permanently | Still in DB |
| **DB size** | Stays lean | Grows over time |
| **Audit trail** | None | Can be restored |
| **Use when** | Test data, temp records | Business-critical data |

> 🔑 **BA must ask:** *Does "delete" in this context mean hard or soft? Can users recover deleted records? Does historical data depend on this?*