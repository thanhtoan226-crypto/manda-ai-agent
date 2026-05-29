---
description: The building blocks of structured data
estimated_minutes: 4
generated: false
id: topic-table-field-record
learning_objective: Map a business concept to a table structure with fields and records
module_id: module-data
sort_order: 1
title: Table, Field & Record
---

## Table / Field / Record

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