# 🏗️ Module 1: System & Architecture

> **Who is this for?** Business Analysts, Product Owners, or anyone who wants to understand how systems work — no coding required.

---

## 1.1 Frontend vs Backend vs Database

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

---

## 1.2 Client – Server

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

---

## 1.3 Monolith vs Microservice

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

---

## 1.4 API Gateway

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

---

## 1.5 Sync vs Async Flow

### ⏱️ Synchronous — "Wait for the result right now"

```
User ──► [System] ──► Process ──► Return result ──► User
         (user waits)              (user receives immediately)

Timeline: |──────────────────────────────────────|
          Send                                 Receive
```

**Examples:** Exchange rate lookup, login, product search.

---

### 📬 Asynchronous — "Send it and keep going"

```
User ──► [System] ──► "Received, processing..." ──► User continues using app
                              │
                              ▼ (seconds or minutes later)
                         Processing complete
                              │
                              ▼
                    Push notification to User
```

**Examples:** Flight booking, exporting large reports, bulk email sends.

> 🔑 **BA needs to determine:** Does the user need the result **immediately**? If not → Async is often the better fit.

---

## 1.6 Queue / Message Broker

### 📦 Think of it as a postal system

```
┌─────────┐    ┌─────────────────────┐    ┌─────────────┐
│PRODUCER │    │   MESSAGE BROKER    │    │  CONSUMER   │
│         │    │   (Post Office)     │    │             │
│"Send    │──► │  📬 📬 📬 📬 📬    │──► │"Process     │
│ order"  │    │  Queue (waiting)    │    │  order"     │
└─────────┘    └─────────────────────┘    └─────────────┘
```

### 💼 Business example: Flash sale order system

**Scenario:** 10,000 users hit "Buy Now" within one second.

**Without a Queue:**
```
10,000 requests ──► Server ──► 💥 Server crashes (overloaded)
```

**With a Queue (Message Broker):**
```
10,000 requests ──► Queue (line up) ──► Server processes one by one
                    [Req1][Req2]...[Req10000]   (100/sec, stable)

User sees immediately: "Order placed! Processing now..."
2 minutes later:       "Order #12345 confirmed!"
```

**Common Message Brokers:** RabbitMQ, Apache Kafka, AWS SQS

> 🔑 **BA needs to know:** If the system uses a Queue, **don't promise real-time delivery** in your spec — define a clear SLA like "within X seconds/minutes".

---

## 📌 Module 1 Summary

| Concept | One-line reminder |
|---------|-------------------|
| Frontend / Backend / DB | Dining room / Kitchen / Storage |
| Client–Server | Guest asks — restaurant responds |
| Monolith | One app does everything — domino risk |
| Microservice | Many small apps, each independent |
| API Gateway | Front desk — all traffic goes through here |
| Sync | Stand and wait for your order |
| Async | Drop off a ticket, pick up when ready |
| Queue | Waiting line — prevents crashes during peak load |
