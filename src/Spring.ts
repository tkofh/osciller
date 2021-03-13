import { SpringConfig, SpringOptions } from './types'
import { completeConfig } from './util'

export default class Spring {
  public readonly key: string
  private _initialVelocity: number

  constructor(options: SpringOptions) {
    const { key, initial, target, velocity, ...config } = options
    this.key = key

    this._initial = initial ?? target ?? 0
    this._target = target ?? initial ?? 0

    this._initialVelocity = velocity ?? 0
    this._velocity = this._initialVelocity

    this._value = this._initial

    this._config = completeConfig(config)
  }

  private _config: Required<SpringConfig>

  get config(): SpringConfig {
    return this._config
  }

  private _initial: number

  get initial(): number {
    return this._initial
  }

  private _target: number

  get target(): number {
    return this._target
  }

  private _value: number

  get value(): number {
    return this._value
  }

  private _velocity: number

  get velocity(): number {
    return this._velocity
  }

  get moving(): boolean {
    return Math.abs(this._velocity) > this._config.restingVelocity!
  }

  get difference(): number {
    return this._value - this._target
  }

  get finished(): boolean {
    return Math.abs(this.difference) < this._config.precision! && !this.moving
  }

  setInitial(initial: number, resetVelocity = false): void {
    this._initial = Number(initial)
    if (resetVelocity) {
      this._velocity = 0
    }
  }

  setTarget(target: number, resetVelocity = false): void {
    this._target = Number(target)
    if (resetVelocity) {
      this._velocity = 0
    }
  }

  setValue(value: number, resetVelocity = true): void {
    this._value = Number(value)
    if (resetVelocity) {
      this._velocity = 0
    }
  }

  setInitialVelocity(velocity: number, resetVelocity = true): void {
    this._initialVelocity = Number(velocity)
    if (resetVelocity) {
      this._velocity = 0
    }
  }

  setConfig(config: SpringConfig, resetVelocity = false): void {
    this._config = completeConfig(config)

    if (resetVelocity) {
      this._velocity = 0
    }
  }

  simulate(dt: number): number {
    const step = 1 // 1ms
    const numSteps = Math.ceil(dt / step)

    if (this.finished) {
      return this.value
    }

    for (let n = 0; n < numSteps; n++) {
      if (this.finished) {
        break
      }

      const springForce = -this._config.tension * 0.000001 * this.difference
      const dampingForce = -this._config.friction * 0.001 * this.velocity
      const acceleration = (springForce + dampingForce) / this._config.mass // pt/ms^2

      this._velocity = this.velocity + acceleration * step // pt/ms
      this._value = this.value + this.velocity * step

      if (this.finished) {
        this._value = this.target
      }
    }
    return this.value
  }

  reset(): void {
    this._value = this.initial
    this._velocity = this._initialVelocity
  }
}
