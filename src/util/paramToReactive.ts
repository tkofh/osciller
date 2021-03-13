import { computed, isRef, reactive, Ref } from 'vue-demi'
import { ReactiveFunction } from '../types'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function paramToReactive<T extends object>(param: T | Ref<T> | ReactiveFunction<T>): T | Ref<T> {
  if (isRef(param)) {
    return param
  } else if (typeof param === 'function') {
    return computed(param as ReactiveFunction<T>)
  } else if (param) {
    return reactive(param) as T
  } else {
    return param
  }
}
