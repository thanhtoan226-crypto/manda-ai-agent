# 🗄️ Module 3: Data & Database Thinking

> **Goal:** Understand how data is structured so you can write tighter specs and avoid common data-related mistakes.

---

## 3.1 Table / Field / Record

A relational database organizes data just like a **spreadsheet**:

```
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
```

| Term | Spreadsheet equivalent | Description |
|------|----------------------|-------------|
| **Table** | Sheet tab | A collection of the same type of data |
| **Field / Column** | Column | One attribute (name, date, price) |
| **Record / Row** | Row | One specific entry |

---

## 3.2 Primary Key vs Foreign Key

### 🔑 Primary Key (PK)

The **unique identifier** of every record in a table. No two records share the same PK.

```
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
```

### 🔗 Foreign Key (FK)

A field used to **link one table to another**.

```
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
```

> 🔑 **BA needs to understand:** To answer *"who placed this order?"*, the system joins two tables via `user_id`.
> When a user is **deleted**, what happens to their orders? → This is a **critical question in your spec!**

---

## 3.3 Enum / Status

**Enum** is a set of **predefined allowed values** — a field can only hold one of those values.

### Example: Order status flow

```
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
```

### Why Enums matter for BAs:

- Enforces **data integrity** — no one can enter random values
- Defines **business rules**: from state A, which states are allowed?
- Prevents bugs like: dev stores `"Confirmed"`, BA queries `"confirmed"`, report filters `"CONFIRMED"` → none match!

> 🔑 **BA action:** For any spec involving status/state, draw a state diagram and define the exact enum values — agree on **consistent casing** (all lowercase or all uppercase).

---

## 3.4 Soft Delete vs Hard Delete

### 🗑️ Hard Delete — Permanently gone

```
BEFORE DELETE:                    AFTER DELETE:
┌────┬────────────┐               ┌────┬────────────┐
│ id │ name       │               │ id │ name       │
├────┼────────────┤  DELETE ──►   ├────┼────────────┤
│  1 │ Product A  │               │  1 │ Product A  │
│  2 │ Product B  │               └────┴────────────┘
│  3 │ Product C  │               (Product B is gone forever)
└────┴────────────┘
```

**Problem:** Old orders linked to Product B will **break** (null reference)!

---

### 🏷️ Soft Delete — Hidden, not gone

```
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
```

| | Hard Delete | Soft Delete |
|--|-------------|-------------|
| **Data** | Gone permanently | Still in DB |
| **DB size** | Stays lean | Grows over time |
| **Audit trail** | None | Can be restored |
| **Use when** | Test data, temp records | Business-critical data |

> 🔑 **BA must ask:** *Does "delete" in this context mean hard or soft? Can users recover deleted records? Does historical data depend on this?*

---

## 3.5 Data Mapping

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

---

## 3.6 Data Validation Layer

Validation is the process of **checking that input data is correct** before saving it to the database.

### The three validation layers:

```
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
```

### Types of validation BAs must define in specs:

| Type | Example |
|------|---------|
| **Required** | Name and phone number cannot be empty |
| **Format** | Email must contain @, phone must be 10 digits |
| **Range** | Age between 18–100, quantity must be > 0 |
| **Unique** | Registration email cannot already exist |
| **Referential** | `product_id` must exist in the products table |
| **Business rule** | End date must be after start date |
| **Conditional** | If customer type = "Business", tax ID is required |

> 🔑 **BA action:** For every field in a form or API, define: *required/optional, data type, max length, format, and the exact error message shown to the user.*

---

## 📌 Module 3 Summary

| Concept | One-line reminder |
|---------|-------------------|
| Table / Field / Record | Sheet / Column / Row in a spreadsheet |
| Primary Key | The "ID card" of each record — unique, never null |
| Foreign Key | The link between two tables |
| Enum | A fixed list of allowed values (like a dropdown) |
| Soft Delete | Hide the record — data is still in the DB |
| Hard Delete | Gone forever — cannot be recovered |
| Data Mapping | Translation guide when integrating two systems |
| Validation | Input rules — BAs must define every rule |
