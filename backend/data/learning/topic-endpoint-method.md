---
description: How to read and understand API endpoints
estimated_minutes: 4
generated: false
id: topic-endpoint-method
learning_objective: Identify HTTP methods (GET, POST, PUT, DELETE) and their purposes
module_id: module-api
sort_order: 2
title: Endpoint & Method
---

## Endpoint / HTTP Method

### 📍 What is an Endpoint?
An endpoint = the **specific address** of one feature in an API.

Example: `https://api.shopvn.com/v1/orders/456`
- `https://api.shopvn.com` → server domain
- `/v1/orders/456` → endpoint (order #456, version 1)

---

### 🔧 HTTP Methods — The 4 core actions

```
┌──────────┬───────────────────┬──────────────────────────────────┐
│ Method   │ Action            │ Business example                 │
├──────────┼───────────────────┼──────────────────────────────────┤
│ GET      │ Read / Fetch data │ View customer list, look up order│
│ POST     │ Create new        │ Place order, register account    │
│ PUT      │ Full update       │ Replace entire profile           │
│ PATCH    │ Partial update    │ Change only the order status     │
│ DELETE   │ Remove            │ Cancel order, delete product     │
└──────────┴───────────────────┴──────────────────────────────────┘
```

> 🔑 **GET never changes data.** Calling it 100 times returns the same result (unless someone else made a change in between).