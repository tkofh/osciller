import { computed, reactive, readonly, watch } from 'vue-demi'
import { Parameters, Reactable, RecordKey, SpringConfig, UseSpringOptions, UseSpringReturn, Values } from './types'
import Spring from './Spring'
import presets from './presets'
import createSpring from './createSpring'
import { isParam, paramToReactive, paramToRef, useRafFn } from './util'

const useSpringDefaults: UseSpringOptions = {
  frozen: false,
}

export default function useSpring<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TParams extends object = Parameters,
  TValues extends Values = Record<keyof TParams, number>
>(
  params: Reactable<TParams>,
  config: Reactable<SpringConfig> = presets.default,
  options: UseSpringOptions<TValues> = {},
): UseSpringReturn<TValues> {
  const springs = new Map<RecordKey, Spring>()

  const mergedOptions: Required<UseSpringOptions> = Object.assign(
    {},
    useSpringDefaults,
    options,
  ) as Required<UseSpringOptions>

  const reactiveParams = paramToReactive<TParams>(params)
  const reactiveConfig = paramToReactive<SpringConfig>(config)

  watch(
    reactiveParams,
    (current, previous) => {
      const previousKeys: Set<string> | null = previous !== undefined ? new Set(Object.keys(previous)) : null

      for (const key of Object.keys(current)) {
        if (!isParam((current as Parameters)[key])) {
          continue
        }
        const param = (current as Parameters)[key]

        const spring = springs.get(key)
        if (!spring) {
          springs.set(key, createSpring(key, config as SpringConfig, param))
        } else {
          previousKeys?.delete(key)
          if (typeof param === 'object') {
            if ('target' in param) {
              spring.setTarget(param.target)
            }
            if ('initial' in param) {
              spring.setInitial(param.initial)
            }
            if ('velocity' in param) {
              spring.setInitialVelocity(param.velocity)
            }
            if ('mass' in param) {
              spring.setConfig({ ...spring.config, mass: param.mass })
            }
          } else {
            spring.setTarget(param as number)
          }
        }
      }

      if (previousKeys) {
        for (const key of previousKeys.values()) {
          springs.delete(key)
        }
      }
    },
    {
      immediate: true,
    },
  )
  watch(reactiveConfig, (config) => {
    for (const spring of springs.values()) {
      spring.setConfig(config as SpringConfig)
    }
  })

  const frozen = paramToRef<boolean>(mergedOptions.frozen)

  const output = reactive<Values>(Object.fromEntries([...springs.values()].map((spring) => [spring.key, spring.value])))
  const values = readonly<TValues>(output as TValues) as TValues

  let last: number = Date.now()
  useRafFn(() => {
    const dt = Date.now() - last
    last += dt

    if (frozen.value) return

    for (const spring of springs.values()) {
      spring.simulate(dt)
      output[spring.key] = spring.value
    }

    if (options.onUpdate) {
      options.onUpdate(values)
    }
  })

  const frozenIsMutable = computed<boolean>((): boolean => {
    const descriptor = Object.getOwnPropertyDescriptor(frozen, 'value') ?? {}
    return ('set' in descriptor || descriptor.writable) === true
  })

  const play = () => {
    if (frozenIsMutable.value) {
      frozen.value = false
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('Attempt to use `play()` with an immutable frozen ref')
    }
  }

  const pause = () => {
    if (frozenIsMutable.value) {
      frozen.value = true
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('Attempt to use `play()` with an immutable frozen ref')
    }
  }

  const reset = (freeze: boolean | undefined = undefined) => {
    for (const spring of springs.values()) {
      spring.reset()
      output[spring.key] = spring.value
    }
    if (freeze === true && !frozen.value) {
      pause()
    } else if (freeze === false && frozen.value) {
      play()
    }
  }

  return {
    values,
    play,
    pause,
    reset,
  }
}
