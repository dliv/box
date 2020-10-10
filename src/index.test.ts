import { box, isBox, isBoxy, unbox, setBox$, BoxLike } from '.';

test('README snippets', () => {
  // Unboxing gets the original value (reference equality)...
  const myObj = {};
  expect(unbox(box(myObj)) === myObj).toBe(true);

  // without mutating the box.
  const myBox = box('contents');
  expect(unbox(myBox) === 'contents').toBe(true);
  expect(unbox(myBox) === 'contents').toBe(true); // still true

  // Like Scheme, the setter has scary punctuation (too bad `set-box!` isn't a valid JS identifier).
  setBox$(myBox, '2');
  expect(unbox(myBox) === '2').toBe(true);
  setBox$(myBox, '3');
  expect(unbox(myBox) === '3').toBe(true);

  function f(maybeBox: unknown) {
    if (isBox(maybeBox)) {
      // maybeBox now has type `Box<unknown>`
      unbox(maybeBox);
    } else {
      // @ts-ignore maybeBox still has type `unknown`
      unbox(maybeBox);
    }
  }
});

describe('isBox', () => {
  test.each`
    a
    ${1}
    ${{ foo: 'bar' }}
    ${[2]}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBox(box($a)) === true', ({ a }) => {
    expect(isBox(box(a))).toBe(true);
  });

  test.each`
    a
    ${1}
    ${{ foo: 'bar' }}
    ${[2]}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBox($a) === false, must come from box()', ({ a }) => {
    expect(isBox(a)).toBe(false);
    expect(isBox([a])).toBe(false);
    expect(isBox({ a })).toBe(false);
    expect(isBox({ '0': a })).toBe(false);
  });
});

describe('isBox', () => {
  test.each`
    a
    ${1}
    ${{ foo: 'bar' }}
    ${[2]}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBox(box($a)) === true', ({ a }) => {
    expect(isBox(box(a))).toBe(true);
  });

  test.each`
    a
    ${1}
    ${{ foo: 'bar' }}
    ${[2]}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBox($a) === false, must come from box()', ({ a }) => {
    expect(isBox(a)).toBe(false);
    expect(isBox([a])).toBe(false);
    expect(isBox({ a })).toBe(false);
    expect(isBox({ '0': a })).toBe(false);
  });
});

describe('isBoxy', () => {
  test.each`
    a
    ${1}
    ${{ foo: 'bar' }}
    ${[2]}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBoxy(box($a)) | isBoxy({$a}) | isBoxy([a]) === true', ({ a }) => {
    // boxes are boxy
    expect(isBoxy(box(a))).toBe(true);

    // and things with zero index
    expect(isBoxy([a])).toBe(true);
    expect(isBoxy({ '0': a })).toBe(true);
  });

  test.each`
    a
    ${1}
    ${null}
    ${undefined}
    ${false}
    ${true}
    ${NaN}
  `('isBoxy($a) === false', ({ a }) => {
    expect(isBoxy(a)).toBe(false);
  });

  test('arrays are boxy', () => {
    const a: any = [];
    expect(unbox(a)).toBe(undefined);
    const myObj = {};
    setBox$(a, myObj);
    expect(unbox(a)).toBe(myObj);
    setBox$(a, 2);
    expect(unbox(a)).toBe(2);
    a.pop();
    expect(unbox(a)).toBe(undefined);
    a.push('a', 'b');
    expect(unbox(a)).toBe('a');
    a.reverse();
    expect(unbox(a)).toBe('b');
  });

  test('objects are boxy', () => {
    const a: any = {};
    expect(unbox(a)).toBe(undefined);
    const myObj = {};
    setBox$(a, myObj);
    expect(unbox(a)).toBe(myObj);
    setBox$(a, 2);
    expect(unbox(a)).toBe(2);
    delete a['0'];
    expect(unbox(a)).toBe(undefined);
    a[0] = 'a';
    expect(unbox(a)).toBe('a');
  });

  test.each`
    a             | t
    ${new Date()} | ${'Date'}
    ${class {}}   | ${'class'}
    ${() => {}}   | ${'function'}
  `('$t is boxy', ({ a }) => {
    expect(isBoxy(a)).toBe(true);
    const myObj: unknown[] = [];
    setBox$(a, myObj);
    expect(unbox(a)).toBe(myObj);
  });
});
