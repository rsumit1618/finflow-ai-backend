# Add A New Table With Prisma

Use this guide when adding a new database table.

## 1. Update `prisma/schema.prisma`

Example `Budget` model:

```prisma
model Budget {
  id        Int      @id @default(autoincrement())
  name      String
  amount    Decimal  @db.Decimal(12, 2)

  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@unique([userId, name])
}
```

Also update related models:

```prisma
model User {
  budgets Budget[]
}
```

## 2. Use Correct Field Types

Use:

- `Decimal @db.Decimal(12, 2)` for money.
- `DateTime` for dates.
- `String?` for optional text.
- `Int` foreign keys.
- `Boolean` for flags.

Avoid:

- `Float` for money.
- Storing secrets in plain text.
- Missing `userId` on user-owned resources.

## 3. Add Ownership

Most finance records should belong to a user.

Required pattern:

```prisma
userId Int
user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

Then every repository query must scope by `userId`.

## 4. Add Indexes

Add indexes based on query patterns.

Examples:

```prisma
@@index([userId])
@@index([userId, createdAt])
@@index([userId, date])
```

## 5. Create Migration

Run from `backend/`:

```bash
npx prisma migrate dev --name add_budget_model
```

If you only want to validate schema:

```bash
npx prisma validate
```

## 6. Regenerate Prisma Client

Usually Prisma migrate does this automatically. If needed:

```bash
npx prisma generate
```

## 7. Add Repository

Create a repository for the new model. Do not call Prisma directly from controllers.

```js
import prisma from "../config/prisma.js";

export const findBudgetByIdForUser = async (id, userId) => {
  return prisma.budget.findFirst({
    where: {
      id,
      userId,
    },
  });
};
```

## Checklist

- Prisma model added.
- Relation added to parent model.
- Money fields use Decimal.
- User-owned records include `userId`.
- Indexes added.
- Migration created.
- Prisma schema validates.
- Repository added.
- API module added or updated.
