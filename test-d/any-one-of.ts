import { expectTypeOf } from 'expect-type'
import { castSchema, SchemaToType } from '../dist'

const anyOfSchema = castSchema({
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
    bar: {
      type: 'string',
    },
    baz: {
      type: 'string',
    },
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

type AnyOfObjType = SchemaToType<typeof anyOfSchema>

expectTypeOf({
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}).toMatchTypeOf<AnyOfObjType>()
expectTypeOf({
  foo: 'foo',
  bar: 'bar',
}).toMatchTypeOf<AnyOfObjType>()
expectTypeOf({
  baz: 'baz',
}).toMatchTypeOf<AnyOfObjType>()
expectTypeOf({
  foo: 'foo',
}).not.toMatchTypeOf<AnyOfObjType>()
function anyOfTestFunc(obj: AnyOfObjType) {
  if ('foo' in obj) {
    expectTypeOf(obj).toHaveProperty('bar').not.toBeNullable()
  } else {
    expectTypeOf(obj).not.toHaveProperty('bar')
  }
}

const oneOfSchema = castSchema({
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
    bar: {
      type: 'string',
    },
    baz: {
      type: 'string',
    },
  },
  oneOf: [
    {
      required: ['foo', 'bar'],
    },
    {
      required: ['baz'],
    },
  ] as const,
})

type OneOfObjType = SchemaToType<typeof oneOfSchema>

expectTypeOf({
  foo: 'foo',
  bar: 'bar',
}).toMatchTypeOf<OneOfObjType>()
expectTypeOf({
  baz: 'baz',
}).toMatchTypeOf<OneOfObjType>()
expectTypeOf({
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}).not.toMatchTypeOf<OneOfObjType>()
expectTypeOf({
  foo: 'foo',
}).not.toMatchTypeOf<OneOfObjType>()
function oneOfTestFunc(obj: OneOfObjType) {
  if (!('foo' in obj)) {
    expectTypeOf(obj).toHaveProperty('baz').not.toBeNullable()
  }
}
