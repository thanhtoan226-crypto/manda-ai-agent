---
description: The three layers of every web application
estimated_minutes: 5
generated: false
id: topic-frontend-backend-db
learning_objective: Explain the roles of frontend, backend, and database and how they
  work together
module_id: module-system
sort_order: 1
title: Frontend, Backend & Database
---

## Frontend vs Backend vs Database

Think of a **restaurant**:

```
┌─────────────────────────────────────────────────────┐
│                    RESTAURANT                       │
│                                                     │
│  🪑 Dining Room      🍳 Kitchen       🗄️ Storage    │
│  (Frontend)          (Backend)        (Database)    │
│                                                     │
│  What guests         Processes        Stores all    │
│  see & touch         requests         ingredients   │
└─────────────────────────────────────────────────────┘
```

| Layer | What it is | Real-world example |
|-------|-----------|-------------------|
| **Frontend** | The interface users see and interact with | App screens, websites, input forms |
| **Backend** | The "brain" — handles logic, rules, calculations | Calculate fees, check permissions, send emails |
| **Database** | Stores all persistent data | Order history, customer profiles |

### 💡 What BAs need to remember

- User sees something **broken on screen** → Frontend issue
- Data is **wrong or missing** → Backend or Database issue
- Screen is **slow or unresponsive** → Backend may be overloaded