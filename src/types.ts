import { Ref } from 'vue-demi'

export type ReactiveFunction<T> = () => T
export type Reactable<T> = T | Ref<T> | ReactiveFunction<T>

export interface SpringConfig {
  friction: number
  tension: number

  min?: number | null
  max?: number | null

  mass?: number
  precision?: number
  restingVelocity?: number
}

export interface SpringOptions extends SpringConfig {
  key: string

  initial?: number
  target?: number
  velocity?: number
}

export interface ParamConfig {
  target: number
  initial: number
  velocity: number
  mass?: number
}

export type RecordKey = string | number | symbol

export type Parameters = Record<string | number | symbol, number | ParamConfig>
export type Values = Record<string | number | symbol, number>

export interface UseSpringOptions<TValues = any> {
  frozen?: Reactable<boolean>
  onUpdate?: (values: TValues) => void
}

export interface UseSpringReturn<TValues> {
  values: TValues
  play: () => void
  pause: () => void
  reset: (freeze: boolean) => void
}
