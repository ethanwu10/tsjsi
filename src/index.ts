import { SetRequired } from 'type-fest'

type Without<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  { [KeyType in Keys]?: never }
type Only<Type, Keys extends keyof Type> = Pick<Type, Keys> &
  { [KeyType in Exclude<keyof Type, Keys>]?: never }

type Values<T> = T[keyof T]
type ArrayValues<Arr extends readonly any[]> = Arr extends readonly (infer T)[]
  ? T
  : 'fail'

type TupleConcat<A extends readonly any[], B extends readonly any[]> = [
  ...A,
  ...B
]

type TupleToMappable<T extends readonly any[]> = Omit<T, keyof []>

type TypeEq<A, B> = A extends B ? (B extends A ? true : false) : false

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
  | NumericSchema<number, any, any>
  | StringSchema<string, any, any>
  | BooleanSchema<boolean, any, any>

export function castSchema<AnyOfSchema extends readonly AnyBaseSchema[]>(
  s: EmptySchema<AnyOfSchema>
): EmptySchema<AnyOfSchema>
export function castSchema<Properties extends Record<string, AnyBaseSchema>>(
  s: ObjectSchema<Properties, never, [], []>
): ObjectSchema<Properties, never, [], []>
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
export function castSchema<
  Properties extends Record<string, AnyBaseSchema>,
  RequiredProps extends keyof Properties = never
>(
  s: ObjectSchema<Properties, RequiredProps, [], []>
): ObjectSchema<Properties, RequiredProps, [], []>
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
      TupleConcat<ExtractObjectAnyOf<Schema>, ExtractObjectOneOf<Schema>>
    >
  >,
  Exclude<
    ExtractRequiredProps<Schema>,
    ObjectSchemaFlattenRequiredArrays<
      TupleConcat<ExtractObjectAnyOf<Schema>, ExtractObjectOneOf<Schema>>
    >
  >
> &
  ObjectSchemaAnyOfPartial<Schema> &
  ObjectSchemaOneOfPartial<Schema>

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
  : Schema extends NumericSchema<infer NumericValues, any, any>
  ? NumericValues
  : Schema extends StringSchema<infer StringValues, any, any>
  ? StringValues
  : Schema extends BooleanSchema<infer BooleanValues, any, any>
  ? BooleanValues
  : Schema extends EnumerableSchema<infer EnumValues, any, any>
  ? EnumValues
  : 'fail'
