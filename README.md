# arraync

Async Array methods polyfills

## Install
> npm install --save arraync

## Setup
```javascript
import 'arraync';
```

## Features and Usage
- forEachAsync\<T>(callback: Func\<T, Promise\<any>>, thisArg?: any): Promise\<void>;
```javascript
await myArray.forEachAsync(async (item) => {
  await doSomethingAsync(item); 
});
```

- everyAsync\<T>(predicate: Func\<T, Promise\<boolean>>, thisArg?: any): Promise\<boolean>;
```javascript
const isEvery = await myArray.everyAsync(async (item) => {
  return await doSomethingAsync(item); 
});
```

- someAsync\<T>(predicate: Func\<T, Promise\<boolean>>, thisArg?: any): Promise\<boolean>;
```javascript
const isSome = await myArray.someAsync(async (item) => {
  return await doSomethingAsync(item); 
});
```

- filterAsync\<T>(predicate: Func\<T, Promise\<boolean>>, thisArg?: any): Promise\<T[]>;
```javascript
const filteredArray = await myArray.filterAsync(async (item) => {
  return await doSomethingAsync(item); 
});
```

- findAsync\<T>(predicate: Func\<T, Promise\<boolean>>, thisArg?: any): Promise\<T>;
```javascript
const foundItem = await myArray.findAsync(async (item) => {
  return await doSomethingAsync(item); 
});
```

- findIndexAsync\<T>(predicate: Func\<T, Promise\<boolean>>, thisArg?: any): Promise\<number>;
```javascript
const foundIndex = await myArray.findIndexAsync(async (item) => {
  return await doSomethingAsync(item); 
});
```

- mapAsync\<T, T1>(callback: Func\<T, Promise\<T1>>, thisArg?: any): Promise\<T1[]>;
```javascript
const mappedArray = await myArray.mapAsync(async (item) => {
  return await doSomethingAsync(item); 
});
