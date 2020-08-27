tsjsi - TypeScript JSON Schema Inference
========================================

A library that allows you to infer a TypeScript type from (a subset of) a JSON
Schema. It accomplishes this by ~~magic~~ a heavily overloaded `castSchema()`
function, which you should wrap around schemas and subschemas.

## Example

```ts
import { castSchema, SchemaToType } from 'tsjsi'

const schema = castSchema({
  type: 'object',
  properties: {
    foo: castSchema({
      type: 'string',
      enum: ['foo', 'frob'],
    }),
    bar: castSchema({
      type: 'integer',
      enum: [0, 1],
    }),
    baz: castSchema({
      type: 'boolean',
    }),
  },
  anyOf: [
    {
      required: ['foo', 'bar'],
    },
    {
      required: ['baz'],
    },
  ] as const,
})

type ObjectType = SchemaToType<typeof schema>
// Inferred as (something equivalent to):
// | {
//     foo: 'foo' | 'frob',
//     bar: 0 | 1,
//   }
// | {
//     baz: boolean,
//   }
```

## Supported JSON Schema features

TODO
