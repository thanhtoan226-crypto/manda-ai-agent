---
description: How your browser talks to a server
estimated_minutes: 4
generated: false
id: topic-client-server
learning_objective: Describe the request-response cycle and what each side does
module_id: module-system
sort_order: 2
title: Client-Server Model
---

## Client – Server

```
        CLIENT                          SERVER
   ┌────────────┐                  ┌────────────┐
   │  📱 App    │  ── Request ──►  │  ⚙️ Server │
   │  Browser   │                  │            │
   │            │  ◄── Response ── │            │
   └────────────┘                  └────────────┘

   User sends a request            Processes & returns result
```

**Real example:** You open a banking app and tap "Check Balance":
1. App (Client) sends a request to the Server: *"Show me the balance for account 001"*
2. Server verifies identity, queries the database
3. Server responds: *"Balance: $2,500"*
4. App displays the number on screen

> 🔑 **Key point:** The client doesn't know data on its own — it must **ask** the server. The server is the single source of truth.