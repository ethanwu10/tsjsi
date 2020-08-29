export type Without<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  { [KeyType in Keys]?: never }
export type Only<Type, Keys extends keyof Type> = Pick<Type, Keys> &
  { [KeyType in Exclude<keyof Type, Keys>]?: never }

export type Values<T> = T[keyof T]
export type ArrayValues<
  Arr extends readonly any[]
> = Arr extends readonly (infer T)[] ? T : 'fail'

export type TupleToMappable<T extends readonly any[]> = Omit<T, keyof []>

export type TypeEq<A, B> = A extends B ? (B extends A ? true : false) : false
