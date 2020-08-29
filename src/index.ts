import { SetRequired } from 'type-fest'
import {
  Without,
  Only,
  Values,
  ArrayValues,
  TupleToMappable,
  TypeEq,
} from './utils'

interface BaseSchema {
  readonly type?: string
  readonly description?: string
}

interface EmptySchema<AnyOfSchema extends readonly AnyBaseSchema[]>
  extends BaseSchema {
  readonly type?: never
  readonly anyOf?: AnyOfSchema
  readonly oneOf?: never /// use anyOf instead
}

interface BaseTypedSchema<
  AnyOfSchema extends readonly Without<AnyBaseSchema, 'type'>[],
  OneOfSchema extends readonly Without<AnyBaseSchema, 'type'>[]
> extends BaseSchema {
  readonly type: string
  readonly anyOf?: AnyOfSchema
  readonly oneOf?: OneOfSchema
}

interface EnumerableSchema<
  ValueType,
  OneOfSchema extends readonly Without<EnumerableSchema<any, [], []>, 'type'>[],
  AnyOfSchema extends readonly Without<EnumerableSchema<any, [], []>, 'type'>[]
> extends BaseTypedSchema<OneOfSchema, AnyOfSchema> {
  enum?: readonly ValueType[]
}

interface ObjectSchema<
  Properties extends Record<string, AnyBaseSchema>,
  RequiredProps extends keyof Properties,
  AnyOfSchema extends readonly Partial<
    Only<
      ObjectSchema<
        Properties,
        Exclude<keyof Properties, RequiredProps>,
        never,
        never
      >,
      'required'
    >
  >[],
  OneOfSchema extends readonly Partial<
    Only<
      ObjectSchema<
        Properties,
        Exclude<keyof Properties, RequiredProps>,
        never,
        never
      >,
      'required'
    >
  >[]
> extends BaseTypedSchema<AnyOfSchema, OneOfSchema> {
  readonly type: 'object'
  readonly properties: Properties
  readonly required?: readonly RequiredProps[]
}

interface BaseArraySchema<
  AnyOfSchema extends readonly Partial<
    Without<BaseArraySchema<never, never>, 'type'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<BaseArraySchema<never, never>, 'type'>
  >[]
> extends BaseTypedSchema<AnyOfSchema, OneOfSchema> {
  readonly type: 'array'
  readonly minItems?: number
  readonly maxItems?: number
  readonly uniqueItems?: boolean
}

interface ArrayListSchema<
  ItemSchema extends AnyBaseSchema,
  AnyOfSchema extends readonly Partial<
    Without<ArrayListSchema<any, never, never>, 'type' | 'items'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<ArrayListSchema<any, never, never>, 'type' | 'items'>
  >[]
> extends BaseArraySchema<AnyOfSchema, OneOfSchema> {
  readonly items: ItemSchema
}

interface ArrayTupleSchema<
  ItemSchemas extends readonly AnyBaseSchema[],
  AdditionalItemsSchema extends boolean | AnyBaseSchema,
  AnyOfSchema extends readonly Partial<
    Without<ArrayTupleSchema<any, never, never, never>, 'type' | 'items'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<ArrayTupleSchema<any, never, never, never>, 'type' | 'items'>
  >[]
> extends BaseArraySchema<AnyOfSchema, OneOfSchema> {
  readonly items: ItemSchemas
  readonly additionalItems?: AdditionalItemsSchema
}

interface NumericSchema<
  EnumValues extends number,
  AnyOfSchema extends readonly Partial<
    Without<NumericSchema<EnumValues, never, never>, 'type'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<NumericSchema<EnumValues, never, never>, 'type'>
  >[]
> extends EnumerableSchema<EnumValues, AnyOfSchema, OneOfSchema> {
  readonly type: 'number' | 'integer'
  readonly minimum?: number
  readonly maximum?: number
}

interface StringSchema<
  EnumValues extends string,
  AnyOfSchema extends readonly Partial<
    Without<StringSchema<EnumValues, never, never>, 'type'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<StringSchema<EnumValues, never, never>, 'type'>
  >[]
> extends EnumerableSchema<EnumValues, AnyOfSchema, OneOfSchema> {
  readonly type: 'string'
}

interface BooleanSchema<
  EnumValues extends boolean,
  AnyOfSchema extends readonly Partial<
    Without<BooleanSchema<EnumValues, never, never>, 'type'>
  >[],
  OneOfSchema extends readonly Partial<
    Without<BooleanSchema<EnumValues, never, never>, 'type'>
  >[]
> extends EnumerableSchema<EnumValues, AnyOfSchema, OneOfSchema> {
  readonly type: 'boolean'
}

type AnyBaseSchema =
  | EmptySchema<readonly AnyBaseSchema[]>
  | ObjectSchema<Record<string, AnyBaseSchema>, string, any, any>
  | ArrayListSchema<AnyBaseSchema, any, any>
  | ArrayTupleSchema<
      readonly AnyBaseSchema[],
      boolean | AnyBaseSchema,
      any,
      any
    >
  | NumericSchema<number, any, any>
  | StringSchema<string, any, any>
  | BooleanSchema<boolean, any, any>

// EmptySchema
export function castSchema<AnyOfSchema extends readonly AnyBaseSchema[]>(
  s: EmptySchema<AnyOfSchema>
): EmptySchema<AnyOfSchema>
// ObjectSchema without `required` or `anyOf`/`oneOf`
export function castSchema<Properties extends Record<string, AnyBaseSchema>>(
  s: ObjectSchema<Properties, never, [], []>
): ObjectSchema<Properties, never, [], []>
// ObjectSchema without `required`
export function castSchema<
  Properties extends Record<string, AnyBaseSchema>,
  AnyOfSchema extends readonly Partial<
    Only<ObjectSchema<Properties, keyof Properties, never, never>, 'required'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Only<ObjectSchema<Properties, keyof Properties, never, never>, 'required'>
  >[] = []
>(
  s: ObjectSchema<Properties, never, AnyOfSchema, OneOfSchema>
): ObjectSchema<Properties, never, AnyOfSchema, OneOfSchema>
// ObjectSchema without `anyOf`/`oneOf`
export function castSchema<
  Properties extends Record<string, AnyBaseSchema>,
  RequiredProps extends keyof Properties = never
>(
  s: ObjectSchema<Properties, RequiredProps, [], []>
): ObjectSchema<Properties, RequiredProps, [], []>
// ObjectSchema
export function castSchema<
  Properties extends Record<string, AnyBaseSchema>,
  RequiredProps extends keyof Properties = never,
  AnyOfSchema extends readonly Partial<
    Only<
      ObjectSchema<
        Properties,
        Exclude<keyof Properties, RequiredProps>,
        never,
        never
      >,
      'required'
    >
  >[] = [],
  OneOfSchema extends readonly Partial<
    Only<
      ObjectSchema<
        Properties,
        Exclude<keyof Properties, RequiredProps>,
        never,
        never
      >,
      'required'
    >
  >[] = []
>(
  s: ObjectSchema<Properties, RequiredProps, AnyOfSchema, OneOfSchema>
): ObjectSchema<Properties, RequiredProps, AnyOfSchema, OneOfSchema>
// ArrayListSchema
export function castSchema<
  ItemSchema extends AnyBaseSchema,
  AnyOfSchema extends readonly Partial<
    Without<ArrayListSchema<any, never, never>, 'type' | 'items'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Without<ArrayListSchema<any, never, never>, 'type' | 'items'>
  >[] = []
>(
  s: ArrayListSchema<ItemSchema, AnyOfSchema, OneOfSchema>
): ArrayListSchema<ItemSchema, AnyOfSchema, OneOfSchema>
// ArrayTupleSchema
export function castSchema<
  ItemSchemas extends readonly AnyBaseSchema[],
  AdditionalItemsSchema extends boolean | AnyBaseSchema = true,
  AnyOfSchema extends readonly Partial<
    Without<ArrayTupleSchema<any, never, never, never>, 'type' | 'items'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Without<ArrayTupleSchema<any, never, never, never>, 'type' | 'items'>
  >[] = []
>(
  s: ArrayTupleSchema<
    ItemSchemas,
    AdditionalItemsSchema,
    AnyOfSchema,
    OneOfSchema
  >
): ArrayTupleSchema<
  ItemSchemas,
  AdditionalItemsSchema,
  AnyOfSchema,
  OneOfSchema
>
// NumericSchema
export function castSchema<
  EnumValues extends number,
  AnyOfSchema extends readonly Partial<
    Without<NumericSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Without<NumericSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  SchemaType extends NumericSchema<
    EnumValues,
    AnyOfSchema,
    OneOfSchema
  > = NumericSchema<EnumValues, AnyOfSchema, OneOfSchema>
>(s: NumericSchema<EnumValues, AnyOfSchema, OneOfSchema>): SchemaType
// StringSchema
export function castSchema<
  EnumValues extends string,
  AnyOfSchema extends readonly Partial<
    Without<StringSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Without<StringSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  SchemaType extends StringSchema<
    EnumValues,
    AnyOfSchema,
    OneOfSchema
  > = StringSchema<EnumValues, AnyOfSchema, OneOfSchema>
>(s: StringSchema<EnumValues, AnyOfSchema, OneOfSchema>): SchemaType
// BooleanSchema
export function castSchema<
  EnumValues extends boolean,
  AnyOfSchema extends readonly Partial<
    Without<BooleanSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  OneOfSchema extends readonly Partial<
    Without<BooleanSchema<EnumValues, never, never>, 'type'>
  >[] = [],
  SchemaType extends BooleanSchema<
    EnumValues,
    AnyOfSchema,
    OneOfSchema
  > = BooleanSchema<EnumValues, AnyOfSchema, OneOfSchema>
>(s: BooleanSchema<EnumValues, AnyOfSchema, OneOfSchema>): SchemaType

export function castSchema<SchemaType extends AnyBaseSchema>(
  s: SchemaType
): SchemaType {
  return s
}

type ExtractProperties<
  SchemaType extends ObjectSchema<any, any, any, any>
> = SchemaType extends ObjectSchema<infer Properties, any, any, any>
  ? Properties
  : 'fail'

type ExtractRequiredProps<
  SchemaType extends ObjectSchema<any, any, any, any>
> = SchemaType extends ObjectSchema<any, infer RequiredProps, any, any>
  ? RequiredProps
  : 'fail'

type ExtractObjectAnyOf<
  SchemaType extends ObjectSchema<any, any, any, any>
> = NonNullable<SchemaType['anyOf']>

type ExtractObjectOneOf<
  SchemaType extends ObjectSchema<any, any, any, any>
> = NonNullable<SchemaType['oneOf']>

type ObjectSchemaPropertiesToType<
  Schema extends ObjectSchema<any, any, any, any>
> = {
  [K in keyof ExtractProperties<Schema>]?: SchemaToType<
    ExtractProperties<Schema>[K]
  >
}

type ObjectSchemaFlattenRequiredArrays<
  Arr extends readonly { required: string }[]
> = Arr extends readonly { required: infer RequiredArrays }[]
  ? RequiredArrays extends readonly (infer Required)[]
    ? Required
    : 'fail'
  : 'fail'

type ObjectSchemaAnyOfPartialInner<
  AOMappable extends Record<any, { required: readonly (keyof PropTypes)[] }>,
  PropTypes
> = Values<
  {
    [K in keyof AOMappable]: Required<
      Pick<PropTypes, ArrayValues<AOMappable[K]['required']>>
    >
  }
>

type ObjectSchemaAnyOfPartial<
  Schema extends ObjectSchema<any, any, any, any>
> = TypeEq<ExtractObjectAnyOf<Schema>, []> extends false
  ? ObjectSchemaAnyOfPartialInner<
      TupleToMappable<ExtractObjectAnyOf<Schema>>,
      ObjectSchemaPropertiesToType<Schema>
    >
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {}

type ObjectSchemaOneOfPartialInner<
  OOAll extends keyof PropTypes,
  OOMappable extends Record<any, { required: readonly OOAll[] }>,
  PropTypes
> = Values<
  {
    [K in keyof OOMappable]: Only<
      Required<Pick<PropTypes, OOAll>>,
      ArrayValues<OOMappable[K]['required']>
    >
  }
>

type ObjectSchemaOneOfPartial<
  Schema extends ObjectSchema<any, any, any, any>
> = TypeEq<ExtractObjectOneOf<Schema>, []> extends false
  ? ObjectSchemaOneOfPartialInner<
      ObjectSchemaFlattenRequiredArrays<ExtractObjectOneOf<Schema>>,
      TupleToMappable<ExtractObjectOneOf<Schema>>,
      ObjectSchemaPropertiesToType<Schema>
    >
  : // eslint-disable-next-line @typescript-eslint/ban-types
    {}

type ObjectSchemaToType<
  Schema extends ObjectSchema<any, any, any, any>
> = SetRequired<
  Omit<
    ObjectSchemaPropertiesToType<Schema>,
    ObjectSchemaFlattenRequiredArrays<
      [...ExtractObjectAnyOf<Schema>, ...ExtractObjectOneOf<Schema>]
    >
  >,
  Exclude<
    ExtractRequiredProps<Schema>,
    ObjectSchemaFlattenRequiredArrays<
      [...ExtractObjectAnyOf<Schema>, ...ExtractObjectOneOf<Schema>]
    >
  >
> &
  ObjectSchemaAnyOfPartial<Schema> &
  ObjectSchemaOneOfPartial<Schema>

type ArrayListSchemaToType<
  Schema extends ArrayListSchema<any, any, any>
> = Schema extends ArrayListSchema<infer ItemSchema, any, any>
  ? SchemaToType<ItemSchema>[]
  : 'fail'

type ArrayTupleItemSchemasToTuple<
  ItemSchemas extends readonly AnyBaseSchema[]
> = {
  recur: ItemSchemas extends readonly [infer First, ...infer Rest]
    ? Rest extends readonly AnyBaseSchema[]
      ? [SchemaToType<First>, ...ArrayTupleItemSchemasToTuple<Rest>]
      : []
    : []
  base: []
}[ItemSchemas extends [] ? 'base' : 'recur']

type ArrayTupleSchemaToType<
  Schema extends ArrayTupleSchema<any, any, any, any>
> = Schema extends ArrayTupleSchema<
  infer ItemSchemas,
  infer AdditionalItemsSchema,
  any,
  any
>
  ? AdditionalItemsSchema extends false
    ? ArrayTupleItemSchemasToTuple<ItemSchemas>
    : AdditionalItemsSchema extends true
    ? [...ArrayTupleItemSchemasToTuple<ItemSchemas>, ...any[]]
    : {
        ok: AdditionalItemsSchema extends AnyBaseSchema
          ? [
              ...ArrayTupleItemSchemasToTuple<ItemSchemas>,
              ...SchemaToType<AdditionalItemsSchema>[]
            ]
          : 'fail'
        fail: 'fail'
      }[AdditionalItemsSchema extends AnyBaseSchema ? 'ok' : 'fail']
  : 'fail'

type EmptySchemaToType<
  Schema extends EmptySchema<any>
> = Schema extends EmptySchema<infer AnyOfSchema>
  ? Values<
      {
        [K in keyof TupleToMappable<AnyOfSchema>]: SchemaToType<
          TupleToMappable<AnyOfSchema>[K]
        >
      }
    >
  : 'fail'

export type SchemaToType<
  Schema extends AnyBaseSchema
> = Schema extends EmptySchema<any>
  ? EmptySchemaToType<Schema>
  : Schema extends ObjectSchema<any, any, any, any>
  ? ObjectSchemaToType<Schema>
  : Schema extends ArrayListSchema<AnyBaseSchema, any, any>
  ? ArrayListSchemaToType<Schema>
  : Schema extends ArrayTupleSchema<readonly AnyBaseSchema[], any, any, any>
  ? ArrayTupleSchemaToType<Schema>
  : Schema extends NumericSchema<infer NumericValues, any, any>
  ? NumericValues
  : Schema extends StringSchema<infer StringValues, any, any>
  ? StringValues
  : Schema extends BooleanSchema<infer BooleanValues, any, any>
  ? BooleanValues
  : Schema extends EnumerableSchema<infer EnumValues, any, any>
  ? EnumValues
  : 'fail'
