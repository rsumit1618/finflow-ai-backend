# Backend Todo Guides

This folder explains how to grow the backend in a consistent, team-friendly way.

Use these guides before adding a new feature module, database table, repository, API route, validation schema, or breaking API change.

## Guides

- [Architecture And Packages](./architecture-and-packages.md)
- [Add A New Module And Repository](./add-new-module-and-repository.md)
- [Add A New Table With Prisma](./add-new-table-with-prisma.md)
- [Add A New API Endpoint](./add-new-api.md)
- [Validation And Error Handling](./validation-and-errors.md)
- [API Versioning And Changing Old APIs](./api-versioning.md)
- [Project Roadmap And Next Steps](./project-roadmap-and-next-steps.md)

## Backend Pattern

Every feature should follow this structure:

```text
src/modules/<feature>/
|-- routes/
|-- controllers/
|-- services/
`-- validators/

src/repositories/
`-- <feature>Repository.js
```

Request flow:

```text
route -> controller -> service -> repository -> Prisma/PostgreSQL
```

Keep this pattern strict. It makes the code easy to scan, test, review, and divide between multiple developers.
