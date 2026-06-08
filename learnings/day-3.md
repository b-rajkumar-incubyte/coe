## NestJS — Building a Task Management Backend

NestJS is a framework for building server-side Node.js applications. It is built on top of Express (or optionally Fastify) and uses TypeScript as its primary language. NestJS borrows architectural patterns from Angular — modules, dependency injection, decorators — and brings them to the backend. It does not replace Node.js or Express; it organises them.

---

## Why NestJS

Plain Express is minimal by design — it gives you routing and middleware and nothing else. This is fine for small projects but as an application grows, there are no conventions for how to organise code, manage dependencies between services, or validate incoming data. Every team invents its own structure.

NestJS provides that structure out of the box. The module system enforces clear boundaries. Dependency injection removes manual wiring. Decorators make intent explicit at a glance. The tradeoff is that it is more opinionated and has a steeper initial learning curve.

---

## NestJS Architecture

A NestJS application is built from three core concepts:

**Modules** are the organisational unit. Every feature lives inside a module. A module declares which controllers and services belong to it. The root `AppModule` ties everything together. Modules are classes decorated with `@Module()`.

**Controllers** handle incoming HTTP requests. They declare routes using decorators like `@Get()`, `@Post()`, and `@Param()`. A controller's only job is to receive a request, delegate to a service, and return a response. No business logic belongs here.

**Services** contain the business logic. They are plain classes decorated with `@Injectable()`. A service is where data is read, transformed, stored, or validated. Controllers call services; services never call controllers.

```
Request → Controller → Service → Response
```

---

## Project Structure and Convention

NestJS uses a feature-based folder structure. Each feature gets its own folder containing its module, controller, service, types, and DTOs:

```
src/
  task/
    dto/
      create-task.dto.ts
    task.controller.ts
    task.service.ts
    task.module.ts
    types.ts
  app.module.ts
  main.ts
```

The CLI command `nest generate` creates these files with the correct boilerplate. The naming convention is `<feature>.<role>.ts` — `task.service.ts`, `task.controller.ts`. This makes the role of every file immediately obvious from the filename.

---

## Decorators

TypeScript supports decorators — a way to attach metadata and behaviour to classes, methods, and properties using `@` syntax. NestJS uses decorators extensively to wire up routing, dependency injection, and validation.

```typescript
@Controller("/task")
export class TaskController {
    @Get()
    getAll() { ... }

    @Post()
    create(@Body() dto: CreateTaskDto) { ... }
}
```

Decorators are not native JavaScript. TypeScript compiles them into `__decorate()` function calls that attach metadata to the class at runtime. Two `tsconfig.json` settings enable this:

- `"experimentalDecorators": true` — enables decorator syntax
- `"emitDecoratorMetadata": true` — emits type information that NestJS reads at runtime for dependency injection and validation

Without these, decorators would either fail to compile or fail to work correctly at runtime.

---

## Dependency Injection

Dependency injection is a pattern where a class declares what it needs rather than creating it itself. NestJS reads the constructor parameter types at runtime and provides the correct instances automatically.

```typescript
@Controller("/task")
export class TaskController {
    constructor(private readonly taskService: TaskService) {}
}
```

For this to work, `TaskService` must be registered as a provider in the module:

```typescript
@Module({
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
```

The `providers` array tells NestJS to manage the lifecycle of `TaskService` and inject it wherever it is requested. `private readonly` in the constructor is TypeScript shorthand — it declares and assigns a class property in one line without needing `this.taskService = taskService` manually.

---

## NestJS is Not a Compiler

NestJS is a runtime framework, not a compiler. TypeScript's compiler (`tsc`) handles all compilation — stripping type annotations, converting decorators to function calls, emitting metadata. NestJS takes over after compilation: it reads the metadata that TypeScript baked into the `.js` files and uses it to bootstrap routing, dependency injection, and request handling.

The full flow:

```
.ts source files
      ↓  tsc (TypeScript compiler)
plain .js files in dist/ + metadata
      ↓  node dist/main.js
NestJS reads metadata → wires up DI and routes
      ↓
Running HTTP server (Express/Fastify underneath)
```

---

## DTOs and Types

Two distinct concepts are used to describe data in a NestJS application:

**Entities / interfaces** describe the internal shape of data. They are TypeScript interfaces and are used inside services and across the codebase. Since they are erased at compile time, they carry no runtime cost.

```typescript
export type TaskStatus = "Not started" | "In progress" | "Done";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
}
```

**DTOs (Data Transfer Objects)** describe the shape of incoming request data. They must be classes — not interfaces — because `class-validator` decorators need to attach metadata to them at runtime, and interfaces are erased by TypeScript compilation.

```typescript
export class CreateTaskDto {
    title!: string;
    description?: string;
}
```

The `!` suffix on required properties is the definite assignment assertion. TypeScript's `strictPropertyInitialization` warns when a class property has no initialiser. For DTOs, NestJS assigns the values when deserialising the request body — something TypeScript cannot see at compile time. The `!` tells TypeScript to trust that the assignment will happen.

---

## Request Validation

NestJS does not validate request bodies by default. Validation requires two separate packages:

- **`class-validator`** — provides decorators (`@IsString()`, `@IsNotEmpty()`, etc.) that define validation rules on DTO properties
- **`class-transformer`** — converts a plain JavaScript object (what the body parser produces) into a real class instance so that `class-validator` decorators can run

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;
}
```

`ValidationPipe` is enabled globally in `main.ts`:

```typescript
app.useGlobalPipes(new ValidationPipe());
```

With this in place, any request that fails validation receives a `400 Bad Request` response automatically before reaching the controller.

---

## How the Request Body Reaches the Controller

Without `ValidationPipe`, the flow is:

```
JSON string → Express body parser → plain object → controller
```

With `ValidationPipe` and `class-transformer`:

```
JSON string → Express body parser → plain object → plainToInstance(CreateTaskDto) → class instance → validated → controller
```

The TypeScript type annotation `@Body() dto: CreateTaskDto` is compile-time only. At runtime, the object is a plain `{}` unless `class-transformer` explicitly converts it. This means `dto instanceof CreateTaskDto` returns `false` without `ValidationPipe` active — the type annotation provides safety during development but does not affect runtime behaviour on its own.

---

## `Map<number, Task>` for In-Memory Storage

Unlike plain JavaScript objects, a `Map` stores keys with their actual type. `map.get(1)` and `map.get("1")` are different lookups. Plain objects always coerce keys to strings — `obj[1]` and `obj["1"]` are the same key.

`Record<string, Task>` is appropriate when keys are strings (e.g. UUIDs). `Map<number, Task>` is the right choice when keys are genuinely numeric and type-accurate lookups matter.

```typescript
private tasks: Map<number, Task> = new Map();
private nextId = 1;

create(dto: CreateTaskDto): Task {
    const task: Task = { id: this.nextId++, ...dto, status: "Not started" };
    this.tasks.set(task.id, task);
    return { ...task };
}
```

The spread `{ ...task }` returns a shallow copy, preventing callers from mutating the internal store.

---

## Calling the API

NestJS only parses a request body as JSON when the `Content-Type: application/json` header is present. Without it, the body parser skips parsing and the controller receives an empty object. This is not a NestJS limitation — it is how HTTP works. The `Content-Type` header tells the server how to interpret the raw bytes.

A valid curl request for a POST endpoint:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "Study NestJS", "description": "Day 3 task"}' \
  "http://localhost:3000/task"
```

JSON requires double-quoted keys. `{title: "value"}` is valid JavaScript object literal syntax but not valid JSON. Sending it without quotes results in a parse error or an empty body depending on the parser.
