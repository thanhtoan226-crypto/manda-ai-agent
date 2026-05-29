---
description: How data translates when moving between systems
estimated_minutes: 5
generated: false
id: topic-data-mapping
learning_objective: Write a data mapping spec that defines field transformations between
  systems
module_id: module-data
sort_order: 5
title: Data Mapping
---

## Data Mapping

Data mapping is the **translation guide** that defines how data moves from one system to another.

### Example: Integrating a CRM with an ERP

```
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
```

### BA template for writing mapping specs:

```
📋 DATA MAPPING TABLE

| Source Field | Type     | Target Field | Type     | Transformation rule     | Required? |
|-------------|----------|-------------|----------|-------------------------|-----------|
| customer_id | INT      | vendor_code  | VARCHAR  | Prefix "CUST-" + ID     | Yes       |
| status      | VARCHAR  | active_flag  | TINYINT  | Enum → integer mapping  | Yes       |
| phone       | VARCHAR  | contact_ph   | VARCHAR  | Normalize to E.164 fmt  | No        |
| (no source) | —        | created_by   | INT      | Default = system_user   | Yes       |
```