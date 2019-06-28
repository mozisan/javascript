type StringMap<TKey extends string> = Record<TKey, string>;

type Arg<TKey extends string> = {
  readonly key: TKey;
  readonly extract: (params: StringMap<TKey>) => string;
};

export const _ = <TKey extends string>(key: TKey): Arg<TKey> => ({
  key,
  extract: (params: StringMap<TKey>) => params[key],
});

type Path<TParams extends object = object> = [keyof TParams] extends [never]
  ? {
      readonly stringified: string;
      readonly build: () => string;
    }
  : {
      readonly stringified: string;
      readonly build: (params: TParams) => string;
    };

type PathBuilder = {
  (values: TemplateStringsArray): Path;
  <TKey extends string>(
    values: TemplateStringsArray,
    ...args: Arg<TKey>[]
  ): Path<StringMap<TKey>>;
};

type PathInstanceOptions = {
  readonly paramPrefix: string;
};

export const createPathInstance = ({
  paramPrefix,
}: PathInstanceOptions): PathBuilder => {
  return ((values: TemplateStringsArray, ...args: Arg<any>[]): Path<any> => {
    const argKeyMap = args
      .map(({ key }) => key)
      .reduce((map, key) => ({ ...map, [key]: `${paramPrefix}${key}` }), {});
    const stringifiedParams = args.map((arg) => arg.extract(argKeyMap));
    const stringifiedPath = values
      .map((value, i) => [value, stringifiedParams[i]])
      .reduce((zipped, elements) => [...zipped, ...elements], [])
      .filter((value) => value != null)
      .join('');

    return {
      stringified: stringifiedPath,
      build(params) {
        const extracted = args.map((arg) => arg.extract(params));

        return values
          .map((value, i) => [value, extracted[i]])
          .reduce((zipped, elements) => [...zipped, ...elements], [])
          .filter((value) => value != null)
          .join('');
      },
    };
  }) as PathBuilder;
};

export const path = createPathInstance({ paramPrefix: ':' });
