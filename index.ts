interface Array<T> {
  forEachAsync(callback: Func<T, Promise<any>>, thisArg?: any): Promise<void>;

  everyAsync(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<boolean>;

  someAsync(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<boolean>;

  filterAsync(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<T[]>;

  findAsync(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<T>;

  findIndexAsync(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<number>;

  mapAsync<T, T1>(callback: Func<T, Promise<T1>>, thisArg?: any): Promise<T1[]>;
}

interface Func<T, TResult> {
  (item: T): TResult;
}

(function() {
  const arrayPrototype = <Array<any>> Array.prototype;

  if (!arrayPrototype.forEachAsync) {
    arrayPrototype.forEachAsync = async function forEachAsync<T1>(callback: Func<T1, Promise<any>>, thisArg?: any): Promise<void> {
      let T, k;

      if (this === null) {
        throw new TypeError(' this is null or not defined');
      }

      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      const O: any = Object(this);

      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      const len: number = O.length >>> 0;

      // 4. If isCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (thisArg !== undefined) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        let kValue;

        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          await callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

  if (!arrayPrototype.everyAsync) {
    arrayPrototype.everyAsync = async function everyAsync<T>(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<boolean> {
      'use strict';
      let T, k;

      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      // 1. Let O be the result of calling ToObject passing the this
      //    value as the argument.
      const O: any = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method
      //    of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      const len: number = O.length >>> 0;

      // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError();
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (thisArg !== undefined) {
        T = thisArg;
      }

      // 6. Let k be 0.
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        let kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal
        //    method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method
          //    of O with argument Pk.
          kValue = O[k];

          // ii. Let testResult be the result of calling the Call internal method
          //     of callbackfn with T as the this value and argument list
          //     containing kValue, k, and O.
          const testResult = await predicate.call(T, kValue, k, O);

          // iii. If ToBoolean(testResult) is false, return false.
          if (!testResult) {
            return false;
          }
        }
        k++;
      }
      return true;
    };
  }

  if (!arrayPrototype.someAsync) {
    arrayPrototype.someAsync = async function someAsync<T>(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<boolean> {
      'use strict';

      if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
      }

      if (typeof predicate !== 'function') {
        throw new TypeError();
      }

      const t: any = Object(this);
      const len: number = t.length >>> 0;

      for(let i = 0; i < len; i++) {
        if (i in t && await predicate.call(thisArg, t[i], i, t)) {
          return true;
        }
      }

      return false;
    };
  }

  if (!arrayPrototype.filterAsync) {
    arrayPrototype.filterAsync = async function filterAsync<T>(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<T[]> {
      'use strict';

      if (this === void 0 || this === null) {
        throw new TypeError();
      }

      const t: any = Object(this);
      const len: number = t.length >>> 0;
      if (typeof predicate !== 'function') {
        throw new TypeError();
      }

      const res: T[] = [];

      for(let i = 0; i < len; i++) {
        if (i in t) {
          const val = t[i];

          // NOTE: Technically this should Object.defineProperty at
          //       the next index, as push can be affected by
          //       properties on Object.prototype and arrayPrototype.
          //       But that method's new, and collisions should be
          //       rare, so use the more-compatible alternative.
          if (await predicate.call(thisArg, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    };
  }

  if (!arrayPrototype.findAsync) {
    arrayPrototype.findAsync = async function findAsync<T>(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<T> {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      const list: any = Object(this);
      const length: number = list.length >>> 0;

      let value;

      for(let i = 0; i < length; i++) {
        value = list[i];
        if (await predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  if (!arrayPrototype.findIndexAsync) {
    arrayPrototype.findIndexAsync = async function findIndexAsync<T>(predicate: Func<T, Promise<boolean>>, thisArg?: any): Promise<number> {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      const list: any = Object(this);
      const length: number = list.length >>> 0;

      let value;

      for(let i = 0; i < length; i++) {
        value = list[i];
        if (await predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    };
  }

  if (!arrayPrototype.mapAsync) {
    arrayPrototype.mapAsync = async function mapAsync<T, T1>(callback: Func<T, Promise<T1>>, thisArg?: any): Promise<T1[]> {

      let T, A, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      // 1. Let O be the result of calling ToObject passing the |this|
      //    value as the argument.
      const O: any = Object(this);

      // 2. Let lenValue be the result of calling the Get internal
      //    method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      const len: number = O.length >>> 0;

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (thisArg !== undefined) {
        T = thisArg;
      }

      // 6. Let A be a new array created as if by the expression new Array(len)
      //    where Array is the standard built-in constructor with that name and
      //    len is the value of len.
      A = new Array(len);

      // 7. Let k be 0
      k = 0;

      // 8. Repeat, while k < len
      while (k < len) {

        let kValue, mappedValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal
        //    method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          //    method of O with argument Pk.
          kValue = O[k];

          // ii. Let mappedValue be the result of calling the Call internal
          //     method of callback with T as the this value and argument
          //     list containing kValue, k, and O.
          mappedValue = await callback.call(T, kValue, k, O);

          // iii. Call the DefineOwnProperty internal method of A with arguments
          // Pk, Property Descriptor
          // { Value: mappedValue,
          //   Writable: true,
          //   Enumerable: true,
          //   Configurable: true },
          // and false.

          // In browsers that support Object.defineProperty, use the following:
          // Object.defineProperty(A, k, {
          //   value: mappedValue,
          //   writable: true,
          //   enumerable: true,
          //   configurable: true
          // });

          // For best browser support, use the following:
          A[k] = mappedValue;
        }
        // d. Increase k by 1.
        k++;
      }

      // 9. return A
      return A;
    };
  }
})();