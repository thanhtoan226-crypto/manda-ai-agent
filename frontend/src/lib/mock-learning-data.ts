import type { LearningModule } from "@/types/learning";

export const MODULE_ICONS: Record<string, string> = {
  "module-system": "Server",
  "module-api": "Plug",
  "module-data": "Database",
  "module-error": "Bug",
  "module-deploy": "Rocket",
};

export const MOCK_LEARNING_MODULES: LearningModule[] = [
  {
    id: "module-system",
    title: "System & Architecture",
    description: "Understand how modern web systems are structured and communicate",
    icon: "server",
    sort_order: 1,
    progress_percent: 0,
    topics: [
      { id: "topic-frontend-backend-db", title: "Frontend, Backend & Database", description: "The three layers of every web application", learning_objective: "Explain the roles of frontend, backend, and database", sort_order: 1, estimated_minutes: 5, completed: false },
      { id: "topic-client-server", title: "Client-Server Model", description: "How your browser talks to a server", learning_objective: "Describe the request-response cycle", sort_order: 2, estimated_minutes: 4, completed: false },
      { id: "topic-monolith-microservice", title: "Monolith vs Microservice", description: "How systems are organised and what it means for your work", learning_objective: "Compare monolith and microservice architectures", sort_order: 3, estimated_minutes: 6, completed: false },
      { id: "topic-api-gateway", title: "API Gateway", description: "The front door of a system", learning_objective: "Explain what an API Gateway does", sort_order: 4, estimated_minutes: 4, completed: false },
      { id: "topic-sync-async", title: "Sync vs Async Communication", description: "When to wait and when to move on", learning_objective: "Distinguish synchronous and asynchronous flows", sort_order: 5, estimated_minutes: 5, completed: false },
      { id: "topic-queue-broker", title: "Queue & Message Broker", description: "How systems talk without blocking each other", learning_objective: "Explain message queues with a business example", sort_order: 6, estimated_minutes: 5, completed: false },
    ],
  },
  {
    id: "module-api",
    title: "API",
    description: "Learn the language of APIs and integrations",
    icon: "plug",
    sort_order: 2,
    progress_percent: 0,
    topics: [
      { id: "topic-rest-api", title: "REST API", description: "The most common way systems communicate", learning_objective: "Explain what a REST API is", sort_order: 1, estimated_minutes: 5, completed: false },
      { id: "topic-endpoint-method", title: "Endpoint & Method", description: "How to read and understand API endpoints", learning_objective: "Identify HTTP methods and their purposes", sort_order: 2, estimated_minutes: 4, completed: false },
      { id: "topic-header-body-param", title: "Header, Body & Parameter", description: "The three places information travels in a request", learning_objective: "Distinguish headers, body, and parameters", sort_order: 3, estimated_minutes: 5, completed: false },
      { id: "topic-json-structure", title: "JSON Structure", description: "What BAs need to read when reviewing API responses", learning_objective: "Read a JSON response and identify key fields", sort_order: 4, estimated_minutes: 5, completed: false },
      { id: "topic-webhook-polling", title: "Webhook vs Polling", description: "Push vs pull — two ways to get updates", learning_objective: "Compare webhooks and polling", sort_order: 5, estimated_minutes: 4, completed: false },
      { id: "topic-auth-authz", title: "Authentication vs Authorization", description: "Who you are vs what you can do", learning_objective: "Distinguish authentication and authorization", sort_order: 6, estimated_minutes: 4, completed: false },
      { id: "topic-token-jwt", title: "Token & JWT", description: "How systems remember who you are between requests", learning_objective: "Explain JWT tokens", sort_order: 7, estimated_minutes: 5, completed: false },
    ],
  },
  {
    id: "module-data",
    title: "Data & Database Thinking",
    description: "Think about data the way engineers do",
    icon: "database",
    sort_order: 3,
    progress_percent: 0,
    topics: [
      { id: "topic-table-field-record", title: "Table, Field & Record", description: "The building blocks of structured data", learning_objective: "Map a business concept to a table structure", sort_order: 1, estimated_minutes: 4, completed: false },
      { id: "topic-pk-fk", title: "Primary Key vs Foreign Key", description: "How records link to each other", learning_objective: "Explain primary and foreign keys", sort_order: 2, estimated_minutes: 4, completed: false },
      { id: "topic-enum-status", title: "Enum & Status", description: "Controlling what values are allowed", learning_objective: "Define an enum for a status field", sort_order: 3, estimated_minutes: 3, completed: false },
      { id: "topic-soft-hard-delete", title: "Soft Delete vs Hard Delete", description: "Why deleted data often isn't really gone", learning_objective: "Compare soft and hard delete", sort_order: 4, estimated_minutes: 4, completed: false },
      { id: "topic-data-mapping", title: "Data Mapping", description: "How data translates when moving between systems", learning_objective: "Write a data mapping spec", sort_order: 5, estimated_minutes: 5, completed: false },
      { id: "topic-data-validation", title: "Data Validation Layer", description: "Catching bad data before it causes problems", learning_objective: "Describe validation layers", sort_order: 6, estimated_minutes: 4, completed: false },
    ],
  },
  {
    id: "module-error",
    title: "Error & Debug Mindset",
    description: "Build your debugging intuition and error literacy",
    icon: "bug",
    sort_order: 4,
    progress_percent: 0,
    topics: [
      { id: "topic-status-codes", title: "HTTP Status Codes", description: "The traffic signals of the web", learning_objective: "Identify common status codes", sort_order: 1, estimated_minutes: 4, completed: false },
      { id: "topic-logs", title: "Logs", description: "The system diary that records everything that happens", learning_objective: "Explain logs and log levels", sort_order: 2, estimated_minutes: 4, completed: false },
      { id: "topic-trace-id", title: "Trace ID", description: "Tracking a single request across the entire system", learning_objective: "Explain how Trace IDs speed up debugging", sort_order: 3, estimated_minutes: 3, completed: false },
      { id: "topic-timeout", title: "Timeout", description: "When the system has waited too long and gives up", learning_objective: "Explain timeout and its business risk", sort_order: 4, estimated_minutes: 4, completed: false },
      { id: "topic-retry-logic", title: "Retry Logic", description: "Automatically trying again — and when it's dangerous", learning_objective: "Explain retry and idempotency risk", sort_order: 5, estimated_minutes: 4, completed: false },
      { id: "topic-cache", title: "Cache", description: "Why you changed it but can't see the change", learning_objective: "Explain caching and stale data", sort_order: 6, estimated_minutes: 5, completed: false },
    ],
  },
  {
    id: "module-deploy",
    title: "Deployment & Environment",
    description: "Understand how code gets from laptop to production",
    icon: "rocket",
    sort_order: 5,
    progress_percent: 0,
    topics: [
      { id: "topic-dev-uat-prod", title: "Dev / UAT / Staging / Production", description: "The journey of code through environments", learning_objective: "Name the standard environments and their purposes", sort_order: 1, estimated_minutes: 5, completed: false },
      { id: "topic-build-deploy", title: "Build vs Deploy", description: "Compiling code vs releasing it", learning_objective: "Distinguish building and deploying", sort_order: 2, estimated_minutes: 4, completed: false },
      { id: "topic-versioning", title: "Versioning", description: "How software tracks changes across releases", learning_objective: "Explain semantic versioning", sort_order: 3, estimated_minutes: 4, completed: false },
      { id: "topic-feature-flag", title: "Feature Flag", description: "Turning features on and off without deploying", learning_objective: "Explain feature flags and safe rollouts", sort_order: 4, estimated_minutes: 4, completed: false },
      { id: "topic-rollback", title: "Rollback", description: "When things go wrong, go back", learning_objective: "Describe rollback strategies", sort_order: 5, estimated_minutes: 4, completed: false },
    ],
  },
];

export const MOCK_TOPIC_CONTENT: Record<string, string> = {
  "topic-frontend-backend-db": `# Frontend, Backend & Database

Think of a **restaurant**:

\`\`\`
┌─────────────────────────────────────────────────────┐
│                    RESTAURANT                       │
│                                                     │
│  🪑 Dining Room      🍳 Kitchen       🗄️ Storage    │
│  (Frontend)          (Backend)        (Database)    │
│                                                     │
│  What guests         Processes        Stores all    │
│  see & touch         requests         ingredients   │
└─────────────────────────────────────────────────────┘
\`\`\`

| Layer | What it is | Real-world example |
|-------|-----------|-------------------|
| **Frontend** | The interface users see and interact with | App screens, websites, input forms |
| **Backend** | The "brain" — handles logic, rules, calculations | Calculate fees, check permissions, send emails |
| **Database** | Stores all persistent data | Order history, customer profiles |

### What BAs need to remember

- User sees something **broken on screen** → Frontend issue
- Data is **wrong or missing** → Backend or Database issue
- Screen is **slow or unresponsive** → Backend may be overloaded`,

  "topic-client-server": `# Client-Server Model

\`\`\`
        CLIENT                          SERVER
   ┌────────────┐                  ┌────────────┐
   │  📱 App    │  ── Request ──►  │  ⚙️ Server │
   │  Browser   │                  │            │
   │            │  ◄── Response ── │            │
   └────────────┘                  └────────────┘

   User sends a request            Processes & returns result
\`\`\`

**Real example:** You open a banking app and tap "Check Balance":
1. App (Client) sends a request to the Server: *"Show me the balance for account 001"*
2. Server verifies identity, queries the database
3. Server responds: *"Balance: $2,500"*
4. App displays the number on screen

> 🔑 **Key point:** The client doesn't know data on its own — it must **ask** the server. The server is the single source of truth.`,

  "topic-monolith-microservice": `# Monolith vs Microservice

## Monolith — "One big building"

\`\`\`
┌──────────────────────────────────────────┐
│           SINGLE APPLICATION             │
│                                          │
│  [Orders] [Payments] [Inventory] [Users] │
│                                          │
│  Everything runs together, one team,     │
│  one deployment                          │
└──────────────────────────────────────────┘
\`\`\`

**Business impact for BAs:**
- ✅ Easy to test end-to-end, easy to trace a flow
- ✅ One release covers everything at once
- ❌ One module fails → **entire system may go down**
- ❌ As teams grow → slower deploys, more code conflicts

## Microservice — "A neighborhood of small houses"

\`\`\`
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
\`\`\`

**Business impact for BAs:**
- ✅ One service failing doesn't break others
- ✅ Teams can deploy independently
- ❌ **More complex specs** — you need to know which service owns what
- ❌ Cross-service bugs are harder to trace (need Trace ID — see Trace ID topic)
- ❌ One business flow may call 3–4 services → more test scenarios

> 🔑 **Ask the tech team:** *"How many services does this flow touch? Which one is the owner?"*`,

  "topic-api-gateway": `# API Gateway

\`\`\`
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
\`\`\`

**What is an API Gateway?** The single entry point that all external requests must pass through. It:
- Checks whether you're authorized to make the call (Authentication)
- Decides which service to route the request to (Routing)
- Limits how many requests one client can make (Rate Limiting)`,

  "topic-sync-async": `# Sync vs Async Communication

## Synchronous — "Wait for the result right now"

\`\`\`
User ──► [System] ──► Process ──► Return result ──► User
         (user waits)              (user receives immediately)

Timeline: |──────────────────────────────────────|
          Send                                 Receive
\`\`\`

**Examples:** Exchange rate lookup, login, product search.

## Asynchronous — "Send it and keep going"

\`\`\`
User ──► [System] ──► "Received, processing..." ──► User continues using app
                              │
                              ▼ (seconds or minutes later)
                         Processing complete
                              │
                              ▼
                    Push notification to User
\`\`\`

**Examples:** Flight booking, exporting large reports, bulk email sends.

> 🔑 **BA needs to determine:** Does the user need the result **immediately**? If not → Async is often the better fit.`,

  "topic-queue-broker": `# Queue & Message Broker

### Think of it as a postal system

\`\`\`
┌─────────┐    ┌─────────────────────┐    ┌─────────────┐
│PRODUCER │    │   MESSAGE BROKER    │    │  CONSUMER   │
│         │    │   (Post Office)     │    │             │
│"Send    │──► │  📬 📬 📬 📬 📬    │──► │"Process     │
│ order"  │    │  Queue (waiting)    │    │  order"     │
└─────────┘    └─────────────────────┘    └─────────────┘
\`\`\`

### Business example: Flash sale order system

**Scenario:** 10,000 users hit "Buy Now" within one second.

**Without a Queue:**
\`\`\`
10,000 requests ──► Server ──► 💥 Server crashes (overloaded)
\`\`\`

**With a Queue (Message Broker):**
\`\`\`
10,000 requests ──► Queue (line up) ──► Server processes one by one
                    [Req1][Req2]...[Req10000]   (100/sec, stable)

User sees immediately: "Order placed! Processing now..."
2 minutes later:       "Order #12345 confirmed!"
\`\`\`

**Common Message Brokers:** RabbitMQ, Apache Kafka, AWS SQS

> 🔑 **BA needs to know:** If the system uses a Queue, **don't promise real-time delivery** in your spec — define a clear SLA like "within X seconds/minutes".`,

  "topic-rest-api": `# REST API

**API** (Application Programming Interface) is a **communication contract** between software systems. Think of it like ordering food at a restaurant through a menu — the API *is* that menu.

**REST API** is the most common style of API, using HTTP (the same protocol as the web) to send and receive data.

\`\`\`
┌────────────────────────────────────────────────────┐
│           REST API = Restaurant Menu               │
│                                                    │
│  GET    /orders       → List all orders            │
│  GET    /orders/123   → Get order #123             │
│  POST   /orders       → Create a new order         │
│  PUT    /orders/123   → Update order #123          │
│  DELETE /orders/123   → Delete order #123          │
└────────────────────────────────────────────────────┘
\`\`\``,

  "topic-endpoint-method": `# Endpoint & HTTP Method

### What is an Endpoint?
An endpoint = the **specific address** of one feature in an API.

Example: \`https://api.shopvn.com/v1/orders/456\`
- \`https://api.shopvn.com\` → server domain
- \`/v1/orders/456\` → endpoint (order #456, version 1)

### HTTP Methods — The core actions

\`\`\`
┌──────────┬───────────────────┬──────────────────────────────────┐
│ Method   │ Action            │ Business example                 │
├──────────┼───────────────────┼──────────────────────────────────┤
│ GET      │ Read / Fetch data │ View customer list, look up order│
│ POST     │ Create new        │ Place order, register account    │
│ PUT      │ Full update       │ Replace entire profile           │
│ PATCH    │ Partial update    │ Change only the order status     │
│ DELETE   │ Remove            │ Cancel order, delete product     │
└──────────┴───────────────────┴──────────────────────────────────┘
\`\`\`

> 🔑 **GET never changes data.** Calling it 100 times returns the same result (unless someone else made a change in between).`,

  "topic-header-body-param": `# Header, Body & Parameter

Every API request has three parts that carry information:

\`\`\`
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
\`\`\`

### Types of parameters:

| Type | Where it lives | When to use | Example |
|------|---------------|-------------|---------|
| **Path Param** | Inside the URL | Identify one specific object | \`/orders/123\` (123 is the ID) |
| **Query Param** | After \`?\` | Filter, search, paginate | \`?status=paid&page=2\` |
| **Body** | Request body | Send data to create/update | \`{ "name": "John Doe" }\` |
| **Header** | Request header | Auth tokens, metadata | \`Authorization: Bearer token...\` |`,

  "topic-json-structure": `# JSON Structure

JSON (JavaScript Object Notation) is the most common data format used in APIs.

### Real example: Response for fetching an order

\`\`\`json
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
\`\`\`

### BA checklist when reviewing JSON with dev:

\`\`\`
📌 Questions to ask when reviewing an API response:

□ "success": true/false → What does the flow look like when false?
□ Which fields are required vs optional?
□ What enum values does "status" support? (confirmed, pending, cancelled...)
□ Timestamps: which timezone? (UTC +0 or local?)
□ Money: what currency/unit? (Is it in cents or dollars?)
□ "errors": when there's an error, what does the error format look like?
\`\`\``,

  "topic-webhook-polling": `# Webhook vs Polling

Two ways to receive information when an event occurs.

## Polling — "Keep asking until something changes"

\`\`\`
Client                          Server
  │                               │
  │──── "Anything new?" ─────────►│
  │◄─── "Nothing yet"             │
  │     (5 seconds later)         │
  │──── "Anything new?" ─────────►│
  │◄─── "Nothing yet"             │
  │     (5 seconds later)         │
  │──── "Anything new?" ─────────►│
  │◄─── "Yes! Order #123 confirmed"│
\`\`\`

**Like:** Manually refreshing your inbox to check for new email.

**Downside:** Wastes resources, not real-time.

## Webhook — "We'll call you when something happens"

\`\`\`
Client                          Server
  │                               │
  │─── Register: "When there's   ►│
  │    a new order, call this URL"│
  │                               │
  │                    (10 minutes later)
  │                               │ ← New order created!
  │◄─── POST /my-webhook-url ─────│
  │     { "event": "order.created", "orderId": 456 }
\`\`\`

**Like:** Subscribing to email notifications when new mail arrives.

**Advantage:** Near real-time, resource efficient.

| | Polling | Webhook |
|--|---------|---------|
| **Who initiates** | Client asks repeatedly | Server calls back on event |
| **Latency** | Depends on interval | Near real-time |
| **Resource cost** | High | Low |
| **Use when** | Server doesn't support webhooks | 3rd-party integrations (Stripe, PayPal) |

> 🔑 **Ask the team:** *"When a third party updates a status (e.g., payment completed), do they use webhooks or do we need to poll?"*`,

  "topic-auth-authz": `# Authentication vs Authorization

These are **two different concepts** that are often confused:

\`\`\`
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🔑 AUTHENTICATION (Identity check)                 │
│     "Who are you?"                                  │
│     → Login with email/password                     │
│     → Result: System knows which user you are       │
│                                                     │
│  🔒 AUTHORIZATION (Permission check)                │
│     "What are you allowed to do?"                  │
│     → Check role/permission                         │
│     → Result: Allow or deny the action             │
└─────────────────────────────────────────────────────┘
\`\`\`

**Real-world examples:**

| Scenario | Authentication | Authorization |
|----------|----------------|---------------|
| Employee scans badge at office | ✅ Badge is valid (we know who) | Which floors can they access? |
| User logs into the app | ✅ Correct password | Can they view financial reports? |
| API receives a token | ✅ Token is valid | Are they allowed to call the delete endpoint? |`,

  "topic-token-jwt": `# Token & JWT

### What is a Token?

A token is an **access pass** the server issues after a successful login.

\`\`\`
1. Login                  2. Receive Token          3. Use Token

User: email + pass  ──►  Server validates  ──►  Token: "eyJhbGc..."
                               │                        │
                          Issues token             Attach to Header
                               │                   of every request
                          User stores token              │
                                                   Server trusts it
\`\`\`

### JWT (JSON Web Token)

JWT is the most common token format, made of 3 parts separated by \`.\`:

\`\`\`
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOjEyM30  .  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV
│                         │                        │
└── Header                └── Payload              └── Signature
    (token type,               (data: userId,          (tamper-proof seal)
     algorithm)                 role, expiry time)
\`\`\`

**Payload typically contains:**
\`\`\`json
{
  "userId": 123,
  "email": "user@email.com",
  "role": "admin",
  "exp": 1705276800
}
\`\`\`

> 🔑 **Ask the team:**
> - *How long does a token last? (15 min? 1 day? 30 days?)*
> - *After a password change, are old tokens invalidated?*
> - *How does the refresh token flow work?*`,

  "topic-table-field-record": `# Table, Field & Record

A relational database organizes data just like a **spreadsheet**:

\`\`\`
TABLE: orders
┌──────────┬──────────┬──────────────┬──────────┬──────────────┐
│ order_id │ user_id  │ total_amount │ status   │ created_at   │
│ (Field)  │ (Field)  │ (Field)      │ (Field)  │ (Field)      │
├──────────┼──────────┼──────────────┼──────────┼──────────────┤
│ 1        │ 101      │ 95.00        │ pending  │ 2024-01-15   │◄── Record (row)
│ 2        │ 102      │ 250.00       │ paid     │ 2024-01-15   │◄── Record (row)
│ 3        │ 101      │ 30.00        │ cancelled│ 2024-01-16   │◄── Record (row)
└──────────┴──────────┴──────────────┴──────────┴──────────────┘
                                        └── Column / Field
\`\`\`

| Term | Spreadsheet equivalent | Description |
|------|----------------------|-------------|
| **Table** | Sheet tab | A collection of the same type of data |
| **Field / Column** | Column | One attribute (name, date, price) |
| **Record / Row** | Row | One specific entry |`,

  "topic-pk-fk": `# Primary Key vs Foreign Key

### Primary Key (PK)

The **unique identifier** of every record in a table. No two records share the same PK.

\`\`\`
TABLE: users
┌─────────┬──────────────────┬─────────────────────┐
│ user_id │ name             │ email               │
│  (PK)   │                  │                     │
├─────────┼──────────────────┼─────────────────────┤
│   101   │ John Smith       │ john@email.com       │
│   102   │ Sarah Lee        │ sarah@email.com      │
│   103   │ Mike Chen        │ mike@email.com       │
└─────────┴──────────────────┴─────────────────────┘
          ↑
          Never duplicated, never null
\`\`\`

### Foreign Key (FK)

A field used to **link one table to another**.

\`\`\`
TABLE: users                    TABLE: orders
┌─────────┬──────────┐          ┌──────────┬─────────┬──────────┐
│ user_id │ name     │          │ order_id │ user_id │ amount   │
│  (PK)   │          │          │  (PK)    │  (FK)   │          │
├─────────┼──────────┤          ├──────────┼─────────┼──────────┤
│   101   │ John     │◄─────────┤    1     │   101   │  95.00   │
│   102   │ Sarah    │◄────┐    │    2     │   102   │ 250.00   │
│   103   │ Mike     │     └────┤    3     │   102   │  30.00   │
└─────────┴──────────┘          └──────────┴─────────┴──────────┘
                                            ↑
                               FK references PK from users table
\`\`\`

> 🔑 **BA needs to understand:** To answer *"who placed this order?"*, the system joins two tables via \`user_id\`.
> When a user is **deleted**, what happens to their orders? → This is a **critical question in your spec!**`,

  "topic-enum-status": `# Enum & Status

**Enum** is a set of **predefined allowed values** — a field can only hold one of those values.

### Example: Order status flow

\`\`\`
                      ORDER STATUS STATE MACHINE

        ┌──────────┐
  ───►  │ PENDING  │  (Created, awaiting processing)
        └────┬─────┘
             │ Confirmed
             ▼
        ┌──────────┐           ┌───────────┐
        │CONFIRMED │           │ CANCELLED │
        └────┬─────┘           └───────────┘
             │ Shipped               ▲
             ▼                       │ Cancel before shipping
        ┌──────────┐                 │
        │ SHIPPING │─────────────────┘
        └────┬─────┘
             │ Delivered
             ▼
        ┌──────────┐
        │DELIVERED │
        └──────────┘
\`\`\`

### Why Enums matter for BAs:

- Enforces **data integrity** — no one can enter random values
- Defines **business rules**: from state A, which states are allowed?
- Prevents bugs like: dev stores \`"Confirmed"\`, BA queries \`"confirmed"\`, report filters \`"CONFIRMED"\` → none match!

> 🔑 **BA action:** For any spec involving status/state, draw a state diagram and define the exact enum values — agree on **consistent casing** (all lowercase or all uppercase).`,

  "topic-soft-hard-delete": `# Soft Delete vs Hard Delete

## Hard Delete — Permanently gone

\`\`\`
BEFORE DELETE:                    AFTER DELETE:
┌────┬────────────┐               ┌────┬────────────┐
│ id │ name       │               │ id │ name       │
├────┼────────────┤  DELETE ──►   ├────┼────────────┤
│  1 │ Product A  │               │  1 │ Product A  │
│  2 │ Product B  │               └────┴────────────┘
│  3 │ Product C  │               (Product B is gone forever)
└────┴────────────┘
\`\`\`

**Problem:** Old orders linked to Product B will **break** (null reference)!

## Soft Delete — Hidden, not gone

\`\`\`
BEFORE "DELETE":                  AFTER "DELETE":
┌────┬────────────┬────────────┐  ┌────┬────────────┬────────────┐
│ id │ name       │ deleted_at │  │ id │ name       │ deleted_at │
├────┼────────────┼────────────┤  ├────┼────────────┼────────────┤
│  1 │ Product A  │ NULL       │  │  1 │ Product A  │ NULL       │
│  2 │ Product B  │ NULL       │► │  2 │ Product B  │ 2024-01-15 │ ← Hidden
│  3 │ Product C  │ NULL       │  │  3 │ Product C  │ NULL       │
└────┴────────────┴────────────┘  └────┴────────────┴────────────┘

Query: WHERE deleted_at IS NULL  → only sees A and C
Data still exists in DB — old orders still reference it safely!
\`\`\`

| | Hard Delete | Soft Delete |
|--|-------------|-------------|
| **Data** | Gone permanently | Still in DB |
| **DB size** | Stays lean | Grows over time |
| **Audit trail** | None | Can be restored |
| **Use when** | Test data, temp records | Business-critical data |

> 🔑 **BA must ask:** *Does "delete" in this context mean hard or soft? Can users recover deleted records? Does historical data depend on this?*`,

  "topic-data-mapping": `# Data Mapping

Data mapping is the **translation guide** that defines how data moves from one system to another.

### Example: Integrating a CRM with an ERP

\`\`\`
CRM SYSTEM (Source)             ERP SYSTEM (Target)

customer_id     ────────────►  vendor_code
full_name       ────────────►  company_name
phone_number    ────────────►  contact_phone
email           ────────────►  email_address
created_date    ────────────►  registration_date

status (enum):                  active_flag (int):
  "active"      ──── MAP ────►  1
  "inactive"    ──── MAP ────►  0
  "suspended"   ──── MAP ────►  2

state_name      ── LOOKUP ───►  state_code
  "California"                    "CA"
  "New York"                      "NY"
\`\`\`

### BA template for writing mapping specs:

\`\`\`
📋 DATA MAPPING TABLE

| Source Field | Type     | Target Field | Type     | Transformation rule     | Required? |
|-------------|----------|-------------|----------|-------------------------|-----------|
| customer_id | INT      | vendor_code  | VARCHAR  | Prefix "CUST-" + ID     | Yes       |
| status      | VARCHAR  | active_flag  | TINYINT  | Enum → integer mapping  | Yes       |
| phone       | VARCHAR  | contact_ph   | VARCHAR  | Normalize to E.164 fmt  | No        |
| (no source) | —        | created_by   | INT      | Default = system_user   | Yes       |
\`\`\``,

  "topic-data-validation": `# Data Validation Layer

Validation is the process of **checking that input data is correct** before saving it to the database.

### The three validation layers:

\`\`\`
USER SUBMITS DATA
        │
        ▼
┌───────────────────┐
│  FRONTEND         │  ← Instant feedback in the browser
│  Validation       │    (email format, required fields)
│  (UX speed)       │    But NOT reliable alone — can be bypassed!
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  BACKEND          │  ← The real validation (most important)
│  Validation       │    • Correct data types?
│  (source of truth)│    • Values within allowed range?
│                   │    • Business rule: is stock available?
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  DATABASE         │  ← Last line of defense
│  Constraints      │    (NOT NULL, UNIQUE, FK constraints)
└───────────────────┘
\`\`\`

### Types of validation BAs must define in specs:

| Type | Example |
|------|---------|
| **Required** | Name and phone number cannot be empty |
| **Format** | Email must contain @, phone must be 10 digits |
| **Range** | Age between 18–100, quantity must be > 0 |
| **Unique** | Registration email cannot already exist |
| **Referential** | \`product_id\` must exist in the products table |
| **Business rule** | End date must be after start date |
| **Conditional** | If customer type = "Business", tax ID is required |

> 🔑 **BA action:** For every field in a form or API, define: *required/optional, data type, max length, format, and the exact error message shown to the user.*`,

  "topic-status-codes": `# HTTP Status Codes

Status codes are numbers the system returns to **communicate the outcome** of a request.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  STATUS CODE CATEGORIES                     │
│                                                             │
│  2xx  ✅  Success                                           │
│  4xx  ❌  CLIENT error (wrong input, missing auth, etc.)    │
│  5xx  💥  SERVER error (dev/infra needs to investigate)     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

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
| **504** | Gateway Timeout | Downstream service too slow | See Timeout topic |

### Quick decision tree when you see an error:

\`\`\`
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
\`\`\``,

  "topic-logs": `# What is a Log?

A **log** is a detailed diary recording **everything that happens** inside a system.

### Example of real log output:

\`\`\`
2024-01-15 14:32:01 [INFO]  [trace:abc123] User 456 requested GET /orders
2024-01-15 14:32:01 [INFO]  [trace:abc123] DB query: SELECT * FROM orders WHERE user_id=456
2024-01-15 14:32:02 [INFO]  [trace:abc123] Returned 5 orders, 200 OK
2024-01-15 14:32:45 [WARN]  [trace:def456] Payment gateway timeout after 3000ms
2024-01-15 14:32:45 [ERROR] [trace:def456] Order 789 failed: Payment service unreachable
2024-01-15 14:32:45 [ERROR] [trace:def456] Stack trace: ConnectionError at PaymentService.charge()
\`\`\`

### Log severity levels:

\`\`\`
DEBUG   → Verbose technical detail (used while debugging)
INFO    → Normal operations ("User A logged in")
WARN    → Something unusual but not yet broken ("Retry attempt 2")
ERROR   → Something failed and needs attention
FATAL   → Critical failure, system may crash
\`\`\`

> 🔑 **When reporting a bug, always give the dev:**
> 1. **Exact time** of the error (hour, minute, second — the more precise, the better)
> 2. **Trace ID** (if the app displays one)
> 3. **Steps to reproduce** the issue
> 4. **Screenshot** of the error screen`,

  "topic-trace-id": `# Trace ID

A **Trace ID** is a unique identifier that follows **a single request across the entire system**.

### Why Trace IDs matter:

\`\`\`
User clicks "Place Order"
        │
        │  Request carries Trace ID: "abc-123-xyz"
        ▼
   [API Gateway]       → log: "abc-123-xyz: Received order request"
        │
        ▼
   [Order Service]     → log: "abc-123-xyz: Creating order for user 456"
        │
        ▼
   [Inventory Service] → log: "abc-123-xyz: Checking stock for product 10"
        │
        ▼
   [Payment Service]   → log: "abc-123-xyz: Processing payment $95.00"
        │
        ▼ ❌ TIMEOUT!
   [Email Service]     → log: "abc-123-xyz: ERROR - Connection timeout"
\`\`\`

Without a Trace ID, a developer has to scan **millions of log lines** to find the problem.

With a Trace ID: \`grep "abc-123-xyz" all_logs.txt\` → instantly shows the full journey!

> 🔑 **BA recommendation:** Propose in your spec that when an error occurs, the **app displays the Trace ID** to the user — it dramatically speeds up support investigations.`,

  "topic-timeout": `# Timeout

**Timeout** is the maximum time a system will **wait for a response** before giving up and returning an error.

### Visual timeline:

\`\`\`
User triggers a payment API call

Timeline:
0s ─────────────────────────────────────────────────► ?
│
│ App sends request ──► Payment Gateway
│                             │
│                      (processing...)
│                             │
│                      (still processing...)
│                             │
30s ── TIMEOUT! ──────────────X
│
└── App shows: "Payment could not be completed. Please try again."
    (But the payment gateway may have already charged the card!)
\`\`\`

### The business problem with Timeout:

\`\`\`
⚠️ IMPORTANT: "Timeout ≠ Failure"

Scenario: User clicks Pay → Timeout at 30s
  • Payment gateway: CHARGED the card  ✓
  • App: Shows "Payment failed"        ✗

→ User is charged but no order is created!
\`\`\`

> 🔑 **BA must ask the tech team:**
> - *What is the timeout duration for each step in the flow?*
> - *When a timeout occurs, does the system rollback?*
> - *What is the reconciliation mechanism to catch "timed out but actually succeeded" cases?*`,

  "topic-retry-logic": `# Retry Logic

**Retry** is the mechanism that **automatically tries again** when a request fails.

\`\`\`
Request attempt 1 ──► ❌ Failed (timeout)
                              │ wait 1s
Request attempt 2 ──► ❌ Failed (server busy)
                              │ wait 2s
Request attempt 3 ──► ✅ Success!
\`\`\`

### Exponential Backoff — The smart retry strategy:

\`\`\`
Retry attempt:   1      2      3      4      5
Wait time:       1s  →  2s  →  4s  →  8s  →  16s  →  Give up

(Each wait doubles — avoids hammering an already overloaded server)
\`\`\`

### ⚠️ Idempotency — The BA risk to know about

**Idempotent** = Calling it once or 100 times produces the same result.

\`\`\`
✅ Idempotent (safe to retry):
   GET /orders/123 → Called 5 times, still returns the same 1 order

❌ Non-idempotent (DANGEROUS to retry):
   POST /payments → Called 3 times = charged 3 times! 💸
\`\`\`

> 🔑 **BA must ask:** *For critical actions (create order, process payment), what prevents duplicates during a retry? Is there an idempotency key mechanism?*`,

  "topic-cache": `# Cache

**Cache** is a temporary copy of data stored somewhere **faster to access** than the original source.

### Why cache exists:

\`\`\`
WITHOUT CACHE:
User ──► App ──► Server ──► Database ──► Result
                                         (slow — DB hit on every request)

WITH CACHE:
User ──► App ──► Cache ──► Result   (fast — no DB call needed)
                  │
                  └── Cache "miss" → ask DB → store in cache → serve
\`\`\`

### Example: Currency exchange rate

\`\`\`
10:00 AM - Cache stores: USD = 1.08 EUR
10:01 AM - 1,000 users ask → all served from cache, DB untouched
10:30 AM - Real rate changes: USD = 1.09 EUR
10:30 AM - Admin updates DB → but cache has NOT refreshed yet!
10:45 AM - Cache expires (TTL = 45 min) → refreshes → now correct!
\`\`\`

### Common reasons for "fixed but not showing yet":

\`\`\`
┌──────────────────┬────────────────────────────────────────────┐
│ Cache location   │ Fix                                        │
├──────────────────┼────────────────────────────────────────────┤
│ Browser cache    │ Ctrl+Shift+R (hard reload), clear cache    │
│ CDN cache        │ Dev/Infra must manually purge the CDN      │
│ App server cache │ Dev must clear it or wait for TTL to expire│
│ Database cache   │ Less common — dev handles it               │
└──────────────────┴────────────────────────────────────────────┘
\`\`\`

**TTL (Time-To-Live):** How long a cached value lives before it auto-refreshes.

> 🔑 **BA checklist before escalating "still not updated" to dev:**
> 1. Browser: tried Ctrl+Shift+R already?
> 2. Which environment? (Dev/UAT may have different cache configs than Prod)
> 3. If all else fails → ask dev to manually clear the cache`,

  "topic-dev-uat-prod": `# Dev / UAT / Staging / Production

Software doesn't go straight to real users — it travels through multiple **checkpoints**:

\`\`\`
┌──────────────────────────────────────────────────────────────────────┐
│                    THE JOURNEY OF A FEATURE                          │
│                                                                      │
│  💻 DEV           🧪 UAT            🔬 STAGING       🌍 PRODUCTION  │
│  ──────────       ────────          ──────────       ────────────   │
│  Dev writes &     BA/QA test        Clone of Prod    Real users     │
│  tests locally    business logic    Performance test Real data      │
│                                                                      │
│  ──────────────────────────────────────────────────────────────►   │
│                       Stability increases →                         │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

### Each environment explained:

| Environment | Purpose | Who uses it | Data | Stability |
|-------------|---------|-------------|------|-----------|
| **DEV** | Active development & experiments | Developers | Fake / mock data | Low — can be down anytime |
| **UAT** (User Acceptance Testing) | Business logic testing & sign-off | BA, PO, business users | Simulated real-like data | Medium |
| **STAGING** | Final check before release | Dev, QA | Clone of production | High — mirrors Production |
| **PRODUCTION** | Live system, real users | End users | Real data | Very high — downtime = lost revenue |

### Real scenario BAs encounter:

\`\`\`
BA says: "I tested it on UAT and it passed — why is it broken in Production?"

Common causes:
• Different config between environments (API keys, endpoints)
• Missing data migration in Staging
• Production users have edge-case data not in UAT
• Feature Flag is ON in UAT but not yet ON in Production
\`\`\`

> 🔑 **Golden rule:** **Never test directly on Production.** If you must verify something there, follow a clear procedure and always have a rollback plan ready.`,

  "topic-build-deploy": `# Build vs Deploy

Two terms that are often used interchangeably — but they mean different things:

\`\`\`
SOURCE CODE               BUILD                    DEPLOY
(Dev writes it)           (Package it)             (Run it on a server)

.js .ts .py   ──────►   app.bundle.zip  ──────►   Server running
.html .css               (Artifact)                app v2.1.0

Analogy:
Raw ingredients ──────►  Packaged product ──────►  On the store shelf
\`\`\`

### A simple CI/CD pipeline:

\`\`\`
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
\`\`\`

> 🔑 **BA needs to know:** When you say *"deploy to UAT"*, it means the pre-built artifact is now running on the UAT server. You don't need to understand the build internals — but you should know: *after sign-off, how long until the feature is live in Production?*`,

  "topic-versioning": `# Versioning

**Versioning** is how software tracks changes across releases so everyone knows what changed and when.

### Semantic Versioning (SemVer) — The most common standard:

\`\`\`
        MAJOR . MINOR . PATCH
          2   .   1   .   3
          │         │       │
          │         │       └── Bug fix — no new features
          │         └── New feature — backward compatible
          └── Breaking change — may not be compatible with older clients
\`\`\`

### What each version bump means for BAs:

| Version change | What changed | BA action |
|---------------|-------------|-----------|
| \`2.1.3 → 2.1.4\` | Patch: bug fix | Retest the affected flow |
| \`2.1.3 → 2.2.0\` | Minor: new feature added | Test new feature + regression check |
| \`2.1.3 → 3.0.0\` | Major: breaking change | **Caution!** All clients may be impacted |

### API Versioning:

\`\`\`
https://api.service.com/v1/orders  ← Old version (still running)
https://api.service.com/v2/orders  ← New version (new structure)

When there's a breaking change, v1 is NOT removed immediately —
existing clients are given time to migrate to v2.
\`\`\``,

  "topic-feature-flag": `# Feature Flag

A **Feature Flag** (also called a Feature Toggle) lets you **turn a feature on or off without redeploying code**.

\`\`\`
┌─────────────────────────────────────────────────────────┐
│              FEATURE FLAG DASHBOARD                     │
│                                                         │
│  Feature                   Status      % of Users       │
│  ──────────────────────────────────────────────────     │
│  new_checkout_flow          ● ON        100%            │
│  ai_recommendation          ● ON         10%  ← Beta    │
│  dark_mode                  ○ OFF          0%           │
│  loyalty_points             ● ON         50%  ← A/B     │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Use cases for Feature Flags:

\`\`\`
1. GRADUAL ROLLOUT
   ─────────────────────────────────────
   Week 1: Enable for 5% of users → monitor for errors
   Week 2: 25% → still stable?
   Week 3: 100% → full release ✅

2. A/B TESTING
   ─────────────────────────────────────
   50% of users → Version A (old checkout)
   50% of users → Version B (new checkout)
   Measure which one has a higher conversion rate

3. KILL SWITCH (Emergency off)
   ─────────────────────────────────────
   Critical bug detected in a new feature?
   → Turn it OFF instantly — no deploy, no rollback needed

4. PERMISSION-BASED RELEASE
   ─────────────────────────────────────
   Internal users / beta testers: ON
   Regular users: OFF (until fully ready)
\`\`\`

> 🔑 **BA should propose a Feature Flag when:**
> - The feature is large or high-risk
> - You need A/B testing
> - The feature depends on an unfinished data migration
> - A phased rollout is planned`,

  "topic-rollback": `# Rollback

**Rollback** means reverting to a previous version when the new one causes problems.

\`\`\`
DEPLOY + ROLLBACK TIMELINE

10:00 AM  Deploy v2.1.0 to Production
          │
10:15 AM  Monitoring: error rate spikes from 0.1% → 5%
          │
10:20 AM  Decision: rollback
          │
10:22 AM  Rollback to v2.0.9 ← Automatic or manual
          │
10:23 AM  Error rate returns to 0.1% ✅
          │
10:30 AM  Post-mortem: investigate root cause in v2.1.0
\`\`\`

### Blue-Green Deployment — The most common rollback-friendly strategy:

\`\`\`
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼────────┐         ┌──────────▼───────┐
    │   🟦 BLUE        │         │   🟩 GREEN        │
    │   (v2.0.9 old)   │         │   (v2.1.0 new)   │
    │   Currently live │         │   Just deployed  │
    └──────────────────┘         └──────────────────┘

Step 1: Deploy v2.1.0 to GREEN (BLUE still serving all traffic)
Step 2: Test GREEN thoroughly
Step 3: Switch traffic to GREEN
Step 4: Problem detected → switch traffic back to BLUE instantly!
\`\`\`

### Rollback vs Hotfix:

| | Rollback | Hotfix |
|--|---------|--------|
| **What it is** | Revert to previous code version | Patch the bug directly in the new version |
| **Time needed** | Minutes | Hours to days |
| **Risk** | Lose new features | May introduce new bugs |
| **Use when** | Severe bug, no quick fix obvious | Small, clear fix available |

> 🔑 **BA should ask before every major release:**
> - *What is the rollback plan if something goes wrong?*
> - *How long does a rollback take?*
> - *Can data migrations be rolled back, or is it one-way?*`,
};
