## NestJS — Completing CRUD, Pipes, and Exception Handling

Day 4 completed the Task Management API with update and delete operations, and introduced the Incubyte BEE plugin for AI-assisted spec-driven development. The key NestJS concepts covered were enums at runtime, partial update DTOs, pipe behaviour, and exception handling patterns.

---

## TypeScript Enums vs String Literal Unions

A string literal union (`"OPEN" | "IN_PROGRESS" | "DONE"`) is a TypeScript-only construct. It is erased during compilation and has no presence in the JavaScript that runs. An enum compiles to a real JavaScript object that persists at runtime:

```javascript
var TaskStatus;
TaskStatus["OPEN"] = "OPEN";
TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
TaskStatus["DONE"] = "DONE";
```

This distinction matters for libraries like `class-validator`. `@IsEnum(TaskStatus)` receives the enum as a runtime argument and calls `Object.values(TaskStatus)` to build the set of allowed values. A string union type cannot be passed — it does not exist at runtime.

Setting enum values explicitly to match their key (`OPEN = 'OPEN'`) keeps the JSON wire format human-readable. A numeric enum would send `0`, `1`, `2` in responses, which is opaque to API consumers without a lookup table.

---

## Partial Update DTOs

A create DTO has required fields. An update DTO has all fields optional — the caller sends only what they want to change. The `@IsOptional()` decorator tells `class-validator` to skip all other decorators on a field when its value is absent. But the other decorators still apply if the field is present:

```typescript
@IsString()
@IsNotEmpty()
@IsOptional()
title?: string;
```

This reads as: the field is not required, but if sent it must be a non-empty string. Without `@IsNotEmpty()`, a client could send `{ "title": "" }` and it would pass validation. The `@IsOptional()` + constraint combination is the standard pattern for any optional-but-validated field in NestJS.

---

## What ValidationPipe Does — and the Role of `transform`

`ValidationPipe` has two separate responsibilities: validation and transformation. By default, only validation runs.

**Validation** checks the plain request body object against the DTO's decorator rules. The body remains a plain `{}` — no class instantiation happens.

**Transformation** converts the plain object into a real DTO class instance using `class-transformer`. This only runs when `transform: true` is passed:

```typescript
@Body(new ValidationPipe({ transform: true }))
```

Without this option, `dto instanceof UpdateTaskDto` is `false` at runtime — the decorator metadata on the DTO class is used for validation, but the object the handler receives is still a plain `{}`.

The reason `transform: true` is important for update DTOs specifically: when `class-transformer` creates a class instance from a partial body, every declared optional property that was not in the body is set to `undefined` — not absent, but explicitly present as `undefined`. This is the correct behaviour for driving partial update logic, where the service needs to distinguish between "caller sent this field" and "caller did not send this field".

Without transformation, all optional fields would simply be absent on the plain object, and `Object.entries(dto)` would produce fewer entries — the filter logic in `task.service.ts` would still work, but only by accident. With transformation, the contract is explicit and reliable.

---

## Exception Handling: Service vs Controller

NestJS ships HTTP exception classes in `@nestjs/common` — `NotFoundException`, `BadRequestException`, `ForbiddenException`, and others. When any of these are thrown in the request lifecycle, NestJS's built-in exception filter catches them and converts them to the appropriate JSON error response automatically.

The architectural question is where to throw. If the service returns `null` when a resource is missing, every controller that calls that method must check and throw. If the service throws directly, the controller stays thin and the logic lives in one place.

NestJS makes service-throws the idiomatic choice by shipping exception classes in `@nestjs/common` rather than `@nestjs/core` or a separate HTTP package. They are designed to be used anywhere in the application — service, guard, pipe — not just in controllers.

---

## Pipes and Their Placement

NestJS pipes can be registered globally, at the controller level, or inline at the parameter level. This project uses inline pipes, which makes the intent explicit — validation and transformation are visible at the exact parameter they apply to rather than being invisible global behaviour.

**`ParseIntPipe`** coerces a route parameter from string to number before the handler runs. Route parameters are always strings — `/task/1` delivers `"1"`. If the segment cannot be parsed (e.g. `/task/abc`), `ParseIntPipe` throws a `BadRequestException` before the method body executes.

**`ValidationPipe`** validates and optionally transforms the request body. Applied inline, each handler declares exactly what it needs — there is no dependency on a global pipe being registered somewhere in `main.ts`.

---

## HTTP 204 and the `@HttpCode` Decorator

NestJS defaults all handlers to HTTP 200. The `@HttpCode` decorator overrides this per handler. DELETE operations conventionally return 204 No Content — the action succeeded and there is no meaningful body to return. Without `@HttpCode(204)`, returning `void` from a handler sends a 200 with an empty body, which is functionally harmless but semantically incorrect.

---

## E2E Tests as HTTP Contracts

Tests in `test/task-update.e2e-spec.ts` and `test/task-delete.e2e-spec.ts` bootstrap the full `AppModule` using `@nestjs/testing` and make real HTTP calls with `supertest`. No mocking — the full request lifecycle runs including pipes, exception filters, and the in-memory store.

E2E tests assert HTTP contracts: status codes, response shapes, data absence after deletion. They do not assert internal call counts or parameter values. This makes them resilient to refactors — an internal restructuring that preserves the HTTP contract does not break any tests.

Each test gets a fresh application instance in `beforeEach`, which means a fresh in-memory `Map`. Test isolation is free — no cleanup needed between tests because each starts from an empty store.

---

## Incubyte BEE Plugin

BEE is a workflow plugin for Claude Code that structures AI-assisted development around specs and slices before code is written. Its philosophy:

> **Developer is the driver. Claude Code is the car. BEE is the GPS.**

The developer decides what to build. Claude Code has the capability to build it. BEE provides the route — a structured process that prevents jumping directly to code before requirements and design are settled.

### Triage and Routing

BEE assesses every task into a size (TRIVIAL / SMALL / FEATURE / EPIC) and risk level (LOW / MODERATE / HIGH) before doing anything. Size determines the workflow depth:

| Size | Workflow |
|---|---|
| TRIVIAL | Make the change immediately |
| SMALL | Context → confirm approach → code → test |
| FEATURE | Spec → architecture → slice loop → review |
| EPIC | Discovery → phase-by-phase FEATURE workflow |

Risk adjusts depth within the chosen workflow — a HIGH risk feature gets more exhaustive specs, more defensive tests, and a stricter ship recommendation.

### Specialist Agents

BEE never does the work itself. It delegates to specialist agents: one reads the codebase (`context-gatherer`), one writes the spec (`spec-builder`), one advises on architecture (`architecture-impl-advisor`), one writes production code per slice (`slice-coder`), one writes tests (`slice-tester`), one gates on quality (`sdd-verifier`), and one reviews the completed feature (`reviewer`). Keeping agents narrow prevents any single context from holding too many competing concerns.

### The Slice Loop

A slice is a shippable subset of acceptance criteria. BEE enforces one slice at a time: code it, test it, verify it passes — then move to the next. This prevents the common pattern of coding an entire feature and writing tests at the end, when design problems discovered by tests require expensive rewrites.

### Spec-Driven vs Test-Driven Development

TDD operates at the code level — a failing test defines a single function's expected behaviour before the implementation exists. SDD operates at the feature level — a spec defines what the feature does from the outside before any code is written. The two are complementary. BEE's slice loop produces TDD-style code within each slice (tests validate the slice-coder's output), while the spec above it ensures those tests cover the right behaviour agreed upon by the developer upfront.
