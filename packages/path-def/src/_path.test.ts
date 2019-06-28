import { _, createPathInstance, path } from './_path';

describe('path()', () => {
  it('works correctly', () => {
    const withoutParams = path`/foo/bar`;
    expect(withoutParams.stringified).toEqual('/foo/bar');
    expect(withoutParams.build()).toEqual('/foo/bar');

    const withParams = path`/foo/${_('hoge')}/bar/${_('fuga')}`;
    expect(withParams.stringified).toEqual('/foo/:hoge/bar/:fuga');
    expect(withParams.build({ hoge: 'aaa', fuga: 'bbb' })).toEqual(
      '/foo/aaa/bar/bbb',
    );
  });
});

describe('createPathInstance()', () => {
  it('works correctly', () => {
    const myPath = createPathInstance({ paramPrefix: '$' });

    const withoutParams = myPath`/foo/bar`;
    expect(withoutParams.stringified).toEqual('/foo/bar');
    expect(withoutParams.build()).toEqual('/foo/bar');

    const withParams = myPath`/foo/${_('hoge')}/bar/${_('fuga')}`;
    expect(withParams.stringified).toEqual('/foo/$hoge/bar/$fuga');
    expect(withParams.build({ hoge: 'aaa', fuga: 'bbb' })).toEqual(
      '/foo/aaa/bar/bbb',
    );
  });
});
