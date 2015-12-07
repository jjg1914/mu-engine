# Mu

A tiny ECS game engine, built on functional programming, immutability and
typescript.

## Mu.Entity

```typescript
interface Mu.Entity extends Immutable.Map<string, Immutable.Map<string, any>> {}
```

An Entity as an object which contains components, mapped by string keys.

## Mu.Engine

```typescript
interface Mu.Engine extends Immutable.Map<number, Mu.Entity> {}

Mu.Engine(): Mu.Engine
```

An Engine is an object which contains entities, mappen by number keys. An empty
engine can be created with the `Mu.Engine` function.

## Mu.System

```typescript
interface Mu.System {
  (engine: Mu.Engine, entity: Mu.Entity): Mu.Engine;
}
```

A System is a function which is used to iterate over each entity in the engine,
and modify the engine state each iteration.

## Mu.MetaComponent

```typescript
class Mu.MetaComponent extends Immutable.Record({ id: 123 }) {}
```

A MetaComponent contains an Entity's unique ID, which can be used to find
itself within the engine.

## Mu.mkEntity

```typescript
Mu.mkEntity(engine: Mu.Engine, entity: Mu.Entity): Mu.Engine
```

Adds an entity to the engine, generating a unique ID and adding a MetaComponent
to the entity.

## Mu.upEntity

```typescript
Mu.upEntity(engine: Mu.Engine, entity: Mu.Entity): Mu.Engine
```

Updates an entity in the engine, using the meta component to locate by id.

## Mu.rmEntity

```typescript
Mu.rmEntity(engine: Mu.Engine, entity: Mu.Entity): Mu.Engine
```

Remove an entity from the engine, using the meta component to locate by id.

## Mu.runSystem

```typescript
Mu.runSystem(engine: Mu.Engine, filters: Immutable.List<string>,
             system: Mu.System): Mu.Engine
```

Run the provided system on each entity in the engine that matches the full set
of filters.

## License

Copyright (c) 2015 John J. Glynn IV

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
