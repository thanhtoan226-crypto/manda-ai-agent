---
description: Push vs pull — two ways to get updates
estimated_minutes: 4
generated: false
id: topic-webhook-polling
learning_objective: Compare webhooks and polling with examples from integration requirements
module_id: module-api
sort_order: 5
title: Webhook vs Polling
---

## Webhook vs Polling

Two ways to receive information when an event occurs.

### 🔄 Polling — "Keep asking until something changes"

```
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
```

**Like:** Manually refreshing your inbox to check for new email.

**Downside:** Wastes resources, not real-time.

---

### 🪝 Webhook — "We'll call you when something happens"

```
Client                          Server
  │                               │
  │─── Register: "When there's   ►│
  │    a new order, call this URL"│
  │                               │
  │                    (10 minutes later)
  │                               │ ← New order created!
  │◄─── POST /my-webhook-url ─────│
  │     { "event": "order.created", "orderId": 456 }
```

**Like:** Subscribing to email notifications when new mail arrives.

**Advantage:** Near real-time, resource efficient.

| | Polling | Webhook |
|--|---------|---------|
| **Who initiates** | Client asks repeatedly | Server calls back on event |
| **Latency** | Depends on interval | Near real-time |
| **Resource cost** | High | Low |
| **Use when** | Server doesn't support webhooks | 3rd-party integrations (Stripe, PayPal) |

> 🔑 **Ask the team:** *"When a third party updates a status (e.g., payment completed), do they use webhooks or do we need to poll?"*