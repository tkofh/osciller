import { ParamConfig, SpringConfig, SpringOptions } from './types'
import Spring from './Spring'

export default function createSpring(key: string, config: SpringConfig, param: number | ParamConfig): Spring {
  let initial: number, target: number, velocity: number, mass: number | undefined
  if (typeof param === 'object') {
    initial = (param as ParamConfig).initial
    target = (param as ParamConfig).target
    velocity = (param as ParamConfig).velocity
    mass = (param as ParamConfig).mass
  } else {
    initial = param as number
    target = initial
    velocity = 0
    mass = undefined
  }

  const options: SpringOptions = {
    key,
    ...config,
    initial,
    target,
    velocity,
  }

  if (mass !== undefined) {
    options.mass = mass
  }

  return new Spring(options)
}
