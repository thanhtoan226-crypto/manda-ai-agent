---
description: How systems talk without blocking each other
estimated_minutes: 5
generated: false
id: topic-queue-broker
learning_objective: Explain message queues with a real business process example
module_id: module-system
sort_order: 6
title: Queue & Message Broker
---

## Queue / Message Broker

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