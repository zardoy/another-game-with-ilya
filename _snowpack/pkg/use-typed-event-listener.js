import { r as react } from './common/index-04edb6a1.js';
import './common/_commonjsHelpers-8c19dec8.js';

function dequal(foo, bar) {
  var ctor, len;
  if (foo === bar)
    return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date)
      return foo.getTime() === bar.getTime();
    if (ctor === RegExp)
      return foo.toString() === bar.toString();
    if (ctor === Array && (len = foo.length) === bar.length) {
      while (len-- && dequal(foo[len], bar[len]))
        ;
      return len === -1;
    }
    if (ctor === Object) {
      if (Object.keys(foo).length !== Object.keys(bar).length)
        return false;
      for (len in foo)
        if (!(len in bar) || !dequal(foo[len], bar[len]))
          return false;
      return true;
    }
  }
  return foo !== foo && bar !== bar;
}

function useDeepCompareMemoize(value) {
  const ref = react.useRef([]);

  if (!dequal(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * `useDeepCompareMemo` will only recompute the memoized value when one of the
 * `deps` has changed.
 *
 * Usage note: only use this if `deps` are objects or arrays that contain
 * objects. Otherwise you should just use React.useMemo.
 *
 */

function useDeepCompareMemo(factory, dependencies) {

  return react.useMemo(factory, useDeepCompareMemoize(dependencies));
}

function __pika_web_default_export_for_treeshaking__(n,o,c,u){const i=react.useRef(c);i.current=c;const m=useDeepCompareMemo(()=>u,[u]);react.useEffect(()=>{if(!n)return;const e=e=>i.current.call(n,e);return n.addEventListener(o,e,m),()=>{n.removeEventListener(o,e,m);}},[n,o,m]);}

export default __pika_web_default_export_for_treeshaking__;
