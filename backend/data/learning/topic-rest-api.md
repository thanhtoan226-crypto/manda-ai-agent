---
description: The most common way systems communicate
estimated_minutes: 5
generated: false
id: topic-rest-api
learning_objective: Explain what a REST API is and why it's the standard for web integrations
module_id: module-api
sort_order: 1
title: REST API
---

## What is a REST API?

**API** (Application Programming Interface) is a **communication contract** between software systems. Think of it like ordering food at a restaurant through a menu — the API *is* that menu.

**REST API** is the most common style of API, using HTTP (the same protocol as the web) to send and receive data.

```
┌────────────────────────────────────────────────────┐
│           REST API = Restaurant Menu               │
│                                                    │
│  GET    /orders       → List all orders            │
│  GET    /orders/123   → Get order #123             │
│  POST   /orders       → Create a new order         │
│  PUT    /orders/123   → Update order #123          │
│  DELETE /orders/123   → Delete order #123          │
└────────────────────────────────────────────────────┘
```