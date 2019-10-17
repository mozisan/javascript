declare const brandKey: unique symbol;
declare const valueKey: unique symbol;

export type Branded<TValue, TBrand> = TValue & {
  readonly [brandKey]: TBrand;
  readonly [valueKey]: TValue;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Branded {
  export type ValueOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TBrand extends Branded<any, any>
  > = TBrand[typeof valueKey];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const createFactory = <TBrand extends Branded<any, any>>() => (
    value: TBrand[typeof valueKey],
  ): TBrand => value as TBrand;
}
