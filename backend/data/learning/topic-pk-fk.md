---
description: How records link to each other
estimated_minutes: 4
generated: false
id: topic-pk-fk
learning_objective: Explain primary and foreign keys using a real data relationship
  example
module_id: module-data
sort_order: 2
title: Primary Key vs Foreign Key
---

## Primary Key vs Foreign Key

### 🔑 Primary Key (PK)

The **unique identifier** of every record in a table. No two records share the same PK.

```
TABLE: users
┌─────────┬──────────────────┬─────────────────────┐
│ user_id │ name             │ email               │
│  (PK)   │                  │                     │
├─────────┼──────────────────┼─────────────────────┤
│   101   │ John Smith       │ john@email.com       │
│   102   │ Sarah Lee        │ sarah@email.com      │
│   103   │ Mike Chen        │ mike@email.com       │
└─────────┴──────────────────┴─────────────────────┘
          ↑
          Never duplicated, never null
```

### 🔗 Foreign Key (FK)

A field used to **link one table to another**.

```
TABLE: users                    TABLE: orders
┌─────────┬──────────┐          ┌──────────┬─────────┬──────────┐
│ user_id │ name     │          │ order_id │ user_id │ amount   │
│  (PK)   │          │          │  (PK)    │  (FK)   │          │
├─────────┼──────────┤          ├──────────┼─────────┼──────────┤
│   101   │ John     │◄─────────┤    1     │   101   │  95.00   │
│   102   │ Sarah    │◄────┐    │    2     │   102   │ 250.00   │
│   103   │ Mike     │     └────┤    3     │   102   │  30.00   │
└─────────┴──────────┘          └──────────┴─────────┴──────────┘
                                            ↑
                               FK references PK from users table
```

> 🔑 **BA needs to understand:** To answer *"who placed this order?"*, the system joins two tables via `user_id`.
> When a user is **deleted**, what happens to their orders? → This is a **critical question in your spec!**