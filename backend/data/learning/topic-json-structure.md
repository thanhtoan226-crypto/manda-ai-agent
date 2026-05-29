---
description: What BAs need to read when reviewing API responses
estimated_minutes: 5
generated: false
id: topic-json-structure
learning_objective: Read a JSON response and identify key fields, data types, and
  nesting
module_id: module-api
sort_order: 4
title: JSON Structure
---

## JSON Structure — What BAs Need to Read

JSON (JavaScript Object Notation) is the most common data format used in APIs.

### Real example: Response for fetching an order

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2024-001",
    "status": "confirmed",
    "customer": {
      "id": 456,
      "name": "John Smith",
      "email": "john@email.com"
    },
    "items": [
      {
        "productId": 10,
        "name": "Latte",
        "quantity": 2,
        "price": 5.50
      },
      {
        "productId": 15,
        "name": "Croissant",
        "quantity": 1,
        "price": 3.00
      }
    ],
    "totalAmount": 14.00,
    "createdAt": "2024-01-15T08:30:00Z"
  },
  "errors": null
}
```

### BA checklist when reviewing JSON with dev:

```
📌 Questions to ask when reviewing an API response:

□ "success": true/false → What does the flow look like when false?
□ Which fields are required vs optional?
□ What enum values does "status" support? (confirmed, pending, cancelled...)
□ Timestamps: which timezone? (UTC +0 or local?)
□ Money: what currency/unit? (Is it in cents or dollars?)
□ "errors": when there's an error, what does the error format look like?
```