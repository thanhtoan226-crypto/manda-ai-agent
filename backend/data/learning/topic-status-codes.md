---
description: The traffic signals of the web
estimated_minutes: 4
generated: false
id: topic-status-codes
learning_objective: Identify common status codes (200, 400, 401, 403, 404, 500) and
  what they mean
module_id: module-error
sort_order: 1
title: HTTP Status Codes
---

## HTTP Status Codes

Status codes are numbers the system returns to **communicate the outcome** of a request.

```
┌─────────────────────────────────────────────────────────────┐
│                  STATUS CODE CATEGORIES                     │
│                                                             │
│  2xx  ✅  Success                                           │
│  4xx  ❌  CLIENT error (wrong input, missing auth, etc.)    │
│  5xx  💥  SERVER error (dev/infra needs to investigate)     │
└─────────────────────────────────────────────────────────────┘
```

### The most important codes:

| Code | Name | Real meaning | Who acts? |
|------|------|--------------|-----------|
| **200** | OK | Success, data returned | — |
| **201** | Created | Successfully created | — |
| **204** | No Content | Success, no data (e.g., after delete) | — |
| **400** | Bad Request | Malformed request, missing field | BA reviews spec, FE fixes validation |
| **401** | Unauthorized | Not logged in / token expired | Redirect to login |
| **403** | Forbidden | Logged in but **no permission** | BA reviews role & permission spec |
| **404** | Not Found | Resource doesn't exist | BA checks endpoint spec |
| **409** | Conflict | Duplicate data (e.g., email already exists) | BA defines uniqueness rules |
| **422** | Unprocessable | Validation failed | BA reviews business rules |
| **500** | Server Error | Internal server failure | Dev checks logs |
| **502** | Bad Gateway | Downstream service not responding | DevOps / Infra |
| **503** | Service Unavailable | Server overloaded or in maintenance | DevOps / Infra |
| **504** | Gateway Timeout | Downstream service too slow | See Timeout section |

### Quick decision tree when you see an error:

```
Got an error?
      │
      ├── 4xx → Ask: "Was something wrong with the request?"
      │         • 401: Is the user logged in? Is the token expired?
      │         • 403: What role does the user have? What role is needed?
      │         • 404: Is the URL correct? Does the ID exist?
      │         • 400/422: Is the data sent in the correct format?
      │
      └── 5xx → Ask the dev: "What does the server log say?"
                • Provide: Trace ID + exact time the error occurred
```