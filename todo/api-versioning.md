# API Versioning And Changing Old APIs

Use this guide before changing an existing API that the frontend or external users may depend on.

## Current State

Current routes use:

```text
/api/auth
/api/categories
/api/expenses
/api/health
```

Production recommendation:

```text
/api/v1/auth
/api/v1/categories
/api/v1/expenses
/api/v1/health
```

## Why API Versioning

API versioning lets us improve the backend without breaking existing clients.

Example:

- Flutter app version 1 uses `/api/v1/expenses`.
- New app version uses `/api/v2/expenses`.
- Old users keep working while new users get the upgraded API.

## Non-Breaking Changes

Usually safe in the same version:

- Add optional response fields.
- Add new endpoint.
- Add optional request field.
- Improve internal performance.
- Fix incorrect status code if clients do not depend on the old one.

## Breaking Changes

Require new version or migration plan:

- Rename response fields.
- Remove response fields.
- Change required request body fields.
- Change auth behavior.
- Change data type.
- Change pagination response shape.
- Change route path.

## Recommended Migration To Versioned API

In `src/app.js`, support old and new routes temporarily:

```js
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
```

After frontend is migrated, remove old routes later.

## Adding V2

If behavior changes deeply, create separate v2 routes:

```text
src/modules/expense/routes/expenseV2Routes.js
src/modules/expense/controllers/expenseV2Controller.js
```

Register:

```js
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v2/expenses", expenseV2Routes);
```

## Deprecation Checklist

Before changing an old API:

- Check frontend usage.
- Check mobile app release impact.
- Add new endpoint or version first.
- Keep old endpoint during transition.
- Document old and new response shape.
- Add tests for both during migration.
- Remove old endpoint only after clients migrate.

## API Change Template

Use this note in PRs:

```text
API Change:
- Endpoint:
- Old behavior:
- New behavior:
- Breaking change: yes/no
- Frontend change required: yes/no
- Migration plan:
- Tests added:
```
