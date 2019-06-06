import React, { createContext, useContext, useMemo } from 'react';

const emptyDeps = Object.create(null);

export const createDIContainer = <TDeps extends object>() => {
  const DepsContext = createContext<TDeps>(emptyDeps as TDeps);

  type DepsProviderProps = {
    readonly children?: React.ReactNode;
    readonly deps: TDeps;
  };

  const DepsProvider: React.FC<DepsProviderProps> = ({ children, deps }) => (
    <DepsContext.Provider value={deps}>{children}</DepsContext.Provider>
  );

  const useDeps = (): TDeps => {
    const deps: TDeps = useContext(DepsContext);

    if (deps === emptyDeps) {
      throw new Error('DepsProvider is not mounted.');
    }

    return deps;
  };

  const createLocal = <TLocalDeps extends object>(
    mapDeps: (deps: TDeps) => TLocalDeps,
  ) => {
    const LocalDepsContext = createContext<TLocalDeps>(emptyDeps as TLocalDeps);

    type LocalDepsProviderProps = {
      readonly children?: React.ReactNode;
      readonly deps: TLocalDeps;
    };

    const LocalDepsProvider: React.FC<LocalDepsProviderProps> = ({
      children,
      deps,
    }) => (
      <LocalDepsContext.Provider value={deps}>
        {children}
      </LocalDepsContext.Provider>
    );

    const useLocalDeps = (): TLocalDeps => {
      const parentDeps: TDeps = useContext(DepsContext);
      const mappedParentDeps: TLocalDeps = useMemo(
        () => (parentDeps !== emptyDeps ? mapDeps(parentDeps) : emptyDeps),
        [parentDeps],
      );

      const localDeps: TLocalDeps = useContext(LocalDepsContext);

      const deps: TLocalDeps =
        localDeps !== emptyDeps ? localDeps : mappedParentDeps;

      if (deps === emptyDeps) {
        throw new Error(
          'Neither DepsProvider nor LocalDepsProvider is not mounted.',
        );
      }

      return deps;
    };

    return {
      LocalDepsProvider,
      useLocalDeps,
    };
  };

  return {
    DepsProvider,
    useDeps,
    createLocal,
  };
};
