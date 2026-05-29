---
description: Compiling code vs releasing it
estimated_minutes: 4
generated: false
id: topic-build-deploy
learning_objective: Distinguish building and deploying and explain why they're separate
  steps
module_id: module-deploy
sort_order: 2
title: Build vs Deploy
---

## Build vs Deploy

Two terms that are often used interchangeably — but they mean different things:

```
SOURCE CODE               BUILD                    DEPLOY
(Dev writes it)           (Package it)             (Run it on a server)

.js .ts .py   ──────►   app.bundle.zip  ──────►   Server running
.html .css               (Artifact)                app v2.1.0

Analogy:
Raw ingredients ──────►  Packaged product ──────►  On the store shelf
```

### A simple CI/CD pipeline:

```
Dev pushes code
      │
      ▼
  [CI Pipeline] ← "Continuous Integration"
  • Run unit tests
  • Check code quality
  • BUILD artifact
      │
      ├── ❌ Tests fail → Notify dev, STOP here
      │
      ▼ ✅ Tests pass
  [CD Pipeline] ← "Continuous Deployment/Delivery"
  • Deploy to Staging
  • Run integration tests
      │
      ▼
  [Manual Approval] ← BA / PO signs off
      │
      ▼
  Deploy to Production 🎉
```

> 🔑 **BA needs to know:** When you say *"deploy to UAT"*, it means the pre-built artifact is now running on the UAT server. You don't need to understand the build internals — but you should know: *after sign-off, how long until the feature is live in Production?*