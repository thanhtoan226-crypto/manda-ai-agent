---
description: How systems are organised and what it means for your work
estimated_minutes: 6
generated: false
id: topic-monolith-microservice
learning_objective: Compare monolith and microservice architectures and their impact
  on BA work
module_id: module-system
sort_order: 3
title: Monolith vs Microservice
---

## Monolith vs Microservice

### 🏢 Monolith — "One big building"

```
┌──────────────────────────────────────────┐
│           SINGLE APPLICATION             │
│                                          │
│  [Orders] [Payments] [Inventory] [Users] │
│                                          │
│  Everything runs together, one team,     │
│  one deployment                          │
└──────────────────────────────────────────┘
```

**Business impact for BAs:**
- ✅ Easy to test end-to-end, easy to trace a flow
- ✅ One release covers everything at once
- ❌ One module fails → **entire system may go down**
- ❌ As teams grow → slower deploys, more code conflicts

---

### 🏘️ Microservice — "A neighborhood of small houses"

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ 🛒 Order │   │ 💳 Pay   │   │ 📦 Stock │   │ 👤 User  │
│ Service  │   │ Service  │   │ Service  │   │ Service  │
│          │◄──┤          │◄──┤          │◄──┤          │
│ Port 3001│   │ Port 3002│   │ Port 3003│   │ Port 3004│
└──────────┘   └──────────┘   └──────────┘   └──────────┘
      │               │               │
      └───────────────┴───────────────┘
                      │
              [API Gateway — shared entry point]
                      │
                  [Client App]
```

**Business impact for BAs:**
- ✅ One service failing doesn't break others
- ✅ Teams can deploy independently
- ❌ **More complex specs** — you need to know which service owns what
- ❌ Cross-service bugs are harder to trace (need Trace ID — see Module 4)
- ❌ One business flow may call 3–4 services → more test scenarios

> 🔑 **Ask the tech team:** *"How many services does this flow touch? Which one is the owner?"*