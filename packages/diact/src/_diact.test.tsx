import React from 'react';
import TestRenderer from 'react-test-renderer';

import { createDIContainer } from './_diact';

describe('createDIContainer()', () => {
  it('provides dependencies successfully', () => {
    type Deps = {
      readonly foo: string;
      readonly bar: number;
    };

    const { DepsProvider, useDeps } = createDIContainer<Deps>();

    const DepsReceiver: React.FC<Deps> = () => null;
    const Component: React.FC = () => <DepsReceiver {...useDeps()} />;

    const { root } = TestRenderer.create(
      <DepsProvider deps={{ foo: 'foo', bar: 1 }}>
        <Component />
      </DepsProvider>,
    );

    const { props: deps } = root.findByType(DepsReceiver);

    expect(deps).toEqual({
      foo: 'foo',
      bar: 1,
    });
  });

  it('throws error if DepsProvider is not mounted', () => {
    type Deps = {
      readonly foo: string;
      readonly bar: number;
    };

    const { useDeps } = createDIContainer<Deps>();

    const Component: React.FC = () => {
      useDeps();

      return null;
    };

    const handleError = jest.fn();

    class App extends React.Component {
      public componentDidCatch(): void {
        handleError();
      }

      public render(): React.ReactElement {
        return <Component />;
      }
    }

    expect(handleError).not.toHaveBeenCalled();

    TestRenderer.create(<App />);

    expect(handleError).toHaveBeenCalled();
  });

  describe('createLocal()', () => {
    it('provides dependencies successfully with DepsProvider', () => {
      type Deps = {
        readonly foo: string;
        readonly bar: number;
      };

      const { DepsProvider, createLocal } = createDIContainer<Deps>();

      type LocalDeps = Pick<Deps, 'foo'>;

      const { useLocalDeps } = createLocal<LocalDeps>(({ foo }) => ({ foo }));

      const DepsReceiver: React.FC<LocalDeps> = () => null;
      const Component: React.FC = () => <DepsReceiver {...useLocalDeps()} />;

      const { root } = TestRenderer.create(
        <DepsProvider deps={{ foo: 'foo', bar: 1 }}>
          <Component />
        </DepsProvider>,
      );

      const { props: deps } = root.findByType(DepsReceiver);

      expect(deps).toEqual({
        foo: 'foo',
      });
    });

    it('provides dependencies successfully with LocalDepsProvider', () => {
      type Deps = {
        readonly foo: string;
        readonly bar: number;
      };

      const { createLocal } = createDIContainer<Deps>();

      type LocalDeps = Pick<Deps, 'foo'>;

      const { LocalDepsProvider, useLocalDeps } = createLocal<LocalDeps>(
        ({ foo }) => ({
          foo,
        }),
      );

      const DepsReceiver: React.FC<LocalDeps> = () => null;
      const Component: React.FC = () => <DepsReceiver {...useLocalDeps()} />;

      const { root } = TestRenderer.create(
        <LocalDepsProvider deps={{ foo: 'foo' }}>
          <Component />
        </LocalDepsProvider>,
      );

      const { props: deps } = root.findByType(DepsReceiver);

      expect(deps).toEqual({
        foo: 'foo',
      });
    });

    it('provides dependencies successfully with DepsProvider and LocalDepsProvider', () => {
      type Deps = {
        readonly foo: string;
        readonly bar: number;
      };

      const { DepsProvider, createLocal } = createDIContainer<Deps>();

      type LocalDeps = Pick<Deps, 'foo'>;

      const { LocalDepsProvider, useLocalDeps } = createLocal<LocalDeps>(
        ({ foo }) => ({
          foo,
        }),
      );

      const DepsReceiver: React.FC<LocalDeps> = () => null;
      const Component: React.FC = () => <DepsReceiver {...useLocalDeps()} />;

      const { root } = TestRenderer.create(
        <DepsProvider deps={{ foo: 'foo-global', bar: 1 }}>
          <LocalDepsProvider deps={{ foo: 'foo-local' }}>
            <Component />
          </LocalDepsProvider>
        </DepsProvider>,
      );

      const { props: deps } = root.findByType(DepsReceiver);

      expect(deps).toEqual({
        foo: 'foo-local',
      });
    });

    it('can contain multiple children', () => {
      type Deps = {
        readonly foo: string;
        readonly bar: number;
      };

      const { DepsProvider, createLocal } = createDIContainer<Deps>();

      type FooDeps = Pick<Deps, 'foo'>;

      const { useLocalDeps: useFooDeps } = createLocal<FooDeps>(({ foo }) => ({
        foo,
      }));

      const Foo: React.FC = () => {
        useFooDeps();

        return <div />;
      };

      type BarDeps = Pick<Deps, 'bar'>;

      const { useLocalDeps: useBarDeps } = createLocal<BarDeps>(({ bar }) => ({
        bar,
      }));

      const Bar: React.FC = () => {
        useBarDeps();

        return <div />;
      };

      const handleError = jest.fn();

      class App extends React.Component {
        public componentDidCatch(): void {
          handleError();
        }

        public render(): React.ReactElement {
          return (
            <DepsProvider deps={{ foo: 'foo', bar: 1 }}>
              <Foo />
              <Bar />
            </DepsProvider>
          );
        }
      }

      TestRenderer.create(<App />);

      expect(handleError).not.toHaveBeenCalled();
    });

    it('throws error if neither DepsProvider nor LocalDepsProvider is not mounted', () => {
      type Deps = {
        readonly foo: string;
        readonly bar: number;
      };

      const { createLocal } = createDIContainer<Deps>();

      const { useLocalDeps } = createLocal(({ foo }) => ({ foo }));

      const Component: React.FC = () => {
        useLocalDeps();

        return null;
      };

      const handleError = jest.fn();

      class App extends React.Component {
        public componentDidCatch(): void {
          handleError();
        }

        public render(): React.ReactElement {
          return <Component />;
        }
      }

      expect(handleError).not.toHaveBeenCalled();

      TestRenderer.create(<App />);

      expect(handleError).toHaveBeenCalled();
    });
  });
});
