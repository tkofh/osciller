import { Ref, unref } from 'vue-demi'
import { ParamConfig } from '../types'

export default function isParam(param: number | ParamConfig | Ref<number | ParamConfig> | any): boolean {
  const value = unref(param)
  return typeof value === 'number' || 'target' in value || 'initial' in value || 'velocity' in value
}
