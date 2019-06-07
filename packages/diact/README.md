# @mozisan/diact

Separate modules which have business logic from UI components, then inject them into components at app runtime.
And you can inject mocks into components in test cases easily.

## Basic usage

### Create DI Container

```tsx
import { createDIContainer } from '@mozisan/diact';

type Foo = {
  readonly doFoo: () => void;
};

type Bar = {
  readonly doBar: () => void;
};

type Deps = {
  readonly foo: Foo;
  readonly bar: Bar;
};

const { DepsProvider, useDeps } = createDIContainer<Deps>();

export { DepsProvider, useDeps };
```

### Use dependencies in Component

```tsx
import React from 'react';
import { useDeps } from 'path/to/di-container';

export const App = () => {
  const { foo, bar } = useDeps();

  return (
    <div>
      <button onClick={foo.doFoo}>Do foo</button>
      <button onClick={bar.doBar}>Do bar</button>
    </div>
  );
};
```

### Provide dependencies

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { DepsProvider } from 'path/to/di-container';
import { App } from 'path/to/app';

const foo = {
  doFoo: () => {
    console.log('foo');
  },
};

const bar = {
  doBar: () => {
    console.log('bar');
  },
};

ReactDOM.render(
  <DepsProvider deps={{ foo, bar }}>
    <App />
  </DepsProvider>,
  document.getElementById('container'),
);
```

## Advanced usage

### Create DI Container

```tsx
import { createDIContainer } from '@mozisan/diact';

type Foo = {
  readonly doFoo: () => void;
};

type Bar = {
  readonly doBar: () => void;
};

type Deps = {
  readonly foo: Foo;
  readonly bar: Bar;
};

const { DepsProvider, useDeps, createLocal } = createDIContainer<Deps>();
                            // ^^^^^^^^^^^ Attention!

export { DepsProvider, useDeps, createLocal };
                             // ^^^^^^^^^^^ Attention!
```

### Use dependencies in Component, whicn are really needed

```tsx
import React from 'react';
import { createLocal } from 'path/to/di-container';

// Attention!
const { LocalDepsProvider, useLocalDeps } = createLocal((deps) => ({ foo: deps.foo }));

// Attention!
export { LocalDepsProvider as FooDepsProvider };

export const Foo = () => {
  // Attention!
  const { foo } = useLocalDeps();

  return (
    <div>
      <button onClick={foo.doFoo}>Do foo</button>
    </div>
  );
};
```

### Provide dependencies

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { DepsProvider } from 'path/to/di-container';
import { Foo } from 'path/to/foo';

const foo = {
  doFoo: () => {
    console.log('foo');
  },
};

const bar = {
  doBar: () => {
    console.log('bar');
  },
};

ReactDOM.render(
  <DepsProvider deps={{ foo, bar }}>
    <Foo />
  </DepsProvider>,
  document.getElementById('container'),
);
```

### Write component tests

```tsx
import { Foo, FooDepsProvider } from 'path/to/foo';
           // ^^^^^^^^^^^^^^^ Attention!

describe('Foo', () => {
  it('works', () => {
    const fooMock = {
      doFoo: () => {
        console.log('foo');
      },
    };

    render(
      <FooDepsProvider deps={{ foo: fooMock }}>
        <Foo />
      </FooDepsProvider>
    );
  });
});
```
