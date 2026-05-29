---
description: The front door of a system
estimated_minutes: 4
generated: false
id: topic-api-gateway
learning_objective: Explain what an API Gateway does and why it matters for integrations
module_id: module-system
sort_order: 4
title: API Gateway
---

## API Gateway

```
                    INTERNET
                        │
                        ▼
              ┌─────────────────┐
              │   API GATEWAY   │  ← The "Front Desk" of the system
              │                 │
              │ • Verify tokens │
              │ • Route requests│
              │ • Rate limiting │
              │ • Log everything│
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    [User Svc]    [Order Svc]   [Pay Svc]
```

**What is an API Gateway?** The single entry point that all external requests must pass through. It:
- Checks whether you're authorized to make the call (Authentication)
- Decides which service to route the request to (Routing)
- Limits how many requests one client can make (Rate Limiting)