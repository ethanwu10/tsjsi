import { expectTypeOf } from 'expect-type'
import { castSchema, SchemaToType } from '../dist'

const schema = castSchema({
  type: 'object',
  properties: {
    foo: {
      type: 'number',
    },
    bar: {
      type: 'boolean',
    },
    baz: {
      type: 'string',
    },
  },
})

type ObjType = SchemaToType<typeof schema>

expectTypeOf({
  foo: 1,
  bar: true,
  baz: 'str',
}).toMatchTypeOf<ObjType>()

expectTypeOf({
  foo: 'str',
}).not.toMatchTypeOf<ObjType>()
expectTypeOf({
  bar: 1,
}).not.toMatchTypeOf<ObjType>()
expectTypeOf({
  baz: true,
}).not.toMatchTypeOf<ObjType>()

const requiredSchema = castSchema({
  type: 'object',
  properties: {
    foo: {
      type: 'number',
    },
    bar: {
      type: 'string',
    },
  },
  required: ['foo'],
})

type RequiredObjType = SchemaToType<typeof requiredSchema>

expectTypeOf({
  foo: 1,
}).toMatchTypeOf<RequiredObjType>()
expectTypeOf({
  foo: 1,
  bar: 'str',
}).toMatchTypeOf<RequiredObjType>()
expectTypeOf({
  bar: 'str',
}).not.toMatchTypeOf<RequiredObjType>()

// Cram everything on one line so that ts-expect-error asserts that an error
// exists *somewhere*
// prettier-ignore
// @ts-expect-error
const badRequired = castSchema({ type: 'object', properties: { foo: { type: 'string' } }, required: ['bar'] })
