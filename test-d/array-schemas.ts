import { expectTypeOf } from 'expect-type'
import { castSchema, SchemaToType } from '../dist'

const listSchema1 = castSchema({
  type: 'array',
  items: castSchema({
    type: 'string',
  }),
})

type ListType1 = SchemaToType<typeof listSchema1>
expectTypeOf<ListType1>().toEqualTypeOf<string[]>()
expectTypeOf<string[]>().toEqualTypeOf<ListType1>()

const listSchema2 = castSchema({
  type: 'array',
  items: castSchema({
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
      bar: {
        type: 'number',
      },
    },
    required: ['foo'],
  }),
})

type ListType2 = SchemaToType<typeof listSchema2>
expectTypeOf<ListType2>().toEqualTypeOf<{ foo: string; bar?: number }[]>()

const tupleSchema1 = castSchema({
  type: 'array',
  items: [
    castSchema({
      type: 'boolean',
    }),
    castSchema({
      type: 'string',
    }),
  ] as const,
})

type TupleType1 = SchemaToType<typeof tupleSchema1>
expectTypeOf<TupleType1>().toEqualTypeOf<[boolean, string, ...any[]]>()

const tupleSchema2 = castSchema({
  type: 'array',
  items: [
    castSchema({
      type: 'boolean',
    }),
    castSchema({
      type: 'string',
    }),
  ] as const,
  additionalItems: false,
})

type TupleType2 = SchemaToType<typeof tupleSchema2>
expectTypeOf<TupleType2>().toEqualTypeOf<[boolean, string]>()

const tupleSchema3 = castSchema({
  type: 'array',
  items: [
    castSchema({
      type: 'boolean',
      enum: [true],
    }),
    castSchema({
      type: 'string',
      enum: ['str'],
    }),
  ] as const,
  additionalItems: castSchema({
    type: 'number',
    enum: [1],
  }),
})

type TupleType3 = SchemaToType<typeof tupleSchema3>
expectTypeOf<TupleType3>().toEqualTypeOf<[true, 'str', ...1[]]>()
