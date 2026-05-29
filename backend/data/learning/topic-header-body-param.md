---
description: The three places information travels in a request
estimated_minutes: 5
generated: false
id: topic-header-body-param
learning_objective: Distinguish headers, body, and parameters and know what goes where
module_id: module-api
sort_order: 3
title: Header, Body & Parameter
---

## Header – Body – Param

Every API request has three parts that carry information:

```
┌─────────────────────────────────────────────────────┐
│                    API REQUEST                      │
│                                                     │
│  📋 HEADER (Meta information)                       │
│  ├── Authorization: Bearer eyJhbGc...               │
│  ├── Content-Type: application/json                 │
│  └── X-Request-ID: abc-123                          │
│                                                     │
│  🌐 URL + PARAMS (Address + filters)                │
│  └── GET /orders?status=pending&page=1&limit=20     │
│                   └──────────────── Query Params    │
│                                                     │
│  📦 BODY (Payload — only for POST/PUT/PATCH)        │
│  └── { "productId": 5, "quantity": 2 }              │
└─────────────────────────────────────────────────────┘
```

### Types of parameters:

| Type | Where it lives | When to use | Example |
|------|---------------|-------------|---------|
| **Path Param** | Inside the URL | Identify one specific object | `/orders/123` (123 is the ID) |
| **Query Param** | After `?` | Filter, search, paginate | `?status=paid&page=2` |
| **Body** | Request body | Send data to create/update | `{ "name": "John Doe" }` |
| **Header** | Request header | Auth tokens, metadata | `Authorization: Bearer token...` |