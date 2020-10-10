# ts-boxed

Like Scheme's [boxes](https://srfi.schemers.org/srfi-111/srfi-111.html) but for TypeScript.

```typescript
unbox(box(myObj)) === myObj
```


## Why

Why do you need this? You *probably* don't. If you've ever wanted JS to have 
pointers to pointers or out parameters, boxes can help.


## Installing

```
npm i ts-boxed
```


## Basic Usage

Boxes are mutable references to a single value.

```typescript
import { box, unbox, setBox$ } from 'ts-boxed';

// Unboxing gets the original value (reference equality)...
const myObj = {};
unbox(box(myObj)) === myObj;

// without mutating the box.
const myBox = box('contents');
unbox(myBox) === 'contents';
unbox(myBox) === 'contents'; // still true

// Like Scheme, the setter has scary punctuation (too bad `set-box!` isn't a valid JS identifier).
setBox$(myBox, '2');
unbox(myBox) === '2';
setBox$(myBox, '3');
unbox(myBox) === '3';
```

## Types

`isBox` is a runtime check but also provides [type information](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
to TypeScript. 

```typescript
  function f(maybeBox: unknown) {
    if (isBox(maybeBox)) {
      // maybeBox now has type `Box<unknown>`
      unbox(maybeBox);
    } else {
      // @ts-ignore maybeBox still has type `unknown`
      unbox(maybeBox);
    }
  }
```
