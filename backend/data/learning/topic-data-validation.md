---
description: Catching bad data before it causes problems
estimated_minutes: 4
generated: false
id: topic-data-validation
learning_objective: Describe validation layers and why BAs should define validation
  rules in requirements
module_id: module-data
sort_order: 6
title: Data Validation Layer
---

## Data Validation Layer

Validation is the process of **checking that input data is correct** before saving it to the database.

### The three validation layers:

```
USER SUBMITS DATA
        │
        ▼
┌───────────────────┐
│  FRONTEND         │  ← Instant feedback in the browser
│  Validation       │    (email format, required fields)
│  (UX speed)       │    But NOT reliable alone — can be bypassed!
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  BACKEND          │  ← The real validation (most important)
│  Validation       │    • Correct data types?
│  (source of truth)│    • Values within allowed range?
│                   │    • Business rule: is stock available?
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  DATABASE         │  ← Last line of defense
│  Constraints      │    (NOT NULL, UNIQUE, FK constraints)
└───────────────────┘
```

### Types of validation BAs must define in specs:

| Type | Example |
|------|---------|
| **Required** | Name and phone number cannot be empty |
| **Format** | Email must contain @, phone must be 10 digits |
| **Range** | Age between 18–100, quantity must be > 0 |
| **Unique** | Registration email cannot already exist |
| **Referential** | `product_id` must exist in the products table |
| **Business rule** | End date must be after start date |
| **Conditional** | If customer type = "Business", tax ID is required |

> 🔑 **BA action:** For every field in a form or API, define: *required/optional, data type, max length, format, and the exact error message shown to the user.*