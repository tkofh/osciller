import { SpringConfig } from '../types'

export default function completeConfig(config: SpringConfig): Required<SpringConfig> {
  return Object.assign<Partial<SpringConfig>, Partial<SpringConfig>, SpringConfig>(
    {},
    {
      mass: 1,
      precision: 0.001,
      restingVelocity: 0.0001,
    },
    config,
  ) as Required<SpringConfig>
}
