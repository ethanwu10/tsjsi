import { expectTypeOf } from 'expect-type'
import { castSchema, SchemaToType } from '../dist'

const numEnumSchema = castSchema({
  type: 'integer',
  enum: [0, 1],
})

type NumEnumType = SchemaToType<typeof numEnumSchema>

expectTypeOf(0 as const).toMatchTypeOf<NumEnumType>()
expectTypeOf(1 as const).toMatchTypeOf<NumEnumType>()
expectTypeOf(2 as const).not.toMatchTypeOf<NumEnumType>()
expectTypeOf(undefined).not.toMatchTypeOf<NumEnumType>()

const strEnumSchema = castSchema({
  type: 'string',
  enum: ['foo', 'bar'],
})

type StrEnumType = SchemaToType<typeof strEnumSchema>

expectTypeOf('foo' as const).toMatchTypeOf<StrEnumType>()
expectTypeOf('bar' as const).toMatchTypeOf<StrEnumType>()
expectTypeOf('baz' as const).not.toMatchTypeOf<StrEnumType>()
expectTypeOf(undefined).not.toMatchTypeOf<StrEnumType>()

const boolEnumSchema = castSchema({
  type: 'boolean',
  enum: [true],
})

type BoolEnumType = SchemaToType<typeof boolEnumSchema>

expectTypeOf(true as const).toMatchTypeOf<BoolEnumType>()
expectTypeOf(false as const).not.toMatchTypeOf<BoolEnumType>()
expectTypeOf(undefined).not.toMatchTypeOf<BoolEnumType>()

const badEnumType1 = castSchema({
  // @ts-ignore: TODO: make this less brittle?
  type: 'integer',
  // @ts-expect-error
  enum: ['string', true],
})
const badEnumType2 = castSchema({
  // @ts-ignore: TODO: make this less brittle?
  type: 'boolean',
  // @ts-expect-error
  enum: ['string', 1],
})
const badEnumType3 = castSchema({
  // @ts-ignore: TODO: make this less brittle?
  type: 'string',
  // @ts-expect-error
  enum: [true, 1],
})
