# osciller

Spring based animation utilities for Vue.js

---

## Usage

```javascript
import { useSpring, presets } from 'osciller'
import { reactive, ref } from 'vue-demi'

const { values, play, pause, reset } = useSpring(
  // use a reactive object if you want to update the targets, or a regular object if you just want to set start and endpoints.
  reactive({
    // configure each parameter with a number as its initial position and target...
    x: 0,
    // ... or with a configuration object
    y: {
      initial: 0,
      target: 10
    },
    // you can also set initial velocity
    z: {
      // omitting either 'initial' or 'target' will make them default to each other. omitting both sets them both to 0
      initial: 0,
      // you can also set the initial velocity
      velocity: 4,
    }
  }),
  // use a configuration object or one of the presets (shown below)
  {
    mass: 1,
    tension: 170,
    friction: 26,

    // precision determines how close the value needs to be to the target to be considered "finished"
    precision: 0.001, // (default)
    // restingVelocity similiarly sets how close to 0 the velocity needs to be to consider the animation finished
    restingVelocity: 0.01, // (default)
  },
  {
    // declaratively set whether the springs should update or not.
    // Can be a ref, a computed, or a reactive function ( i.e. () => someComputed.value > 0.5 )
    freeze: ref(true),
    // by default, if you don't pass a reactive config or parameters value, useSpring won't watch for changes.
    // setting 'reactive: true' here will override this. Useful for objects of refs that don't pass vue's isReactive() normally.
  }
)

// using play() and pause() won't work if you passed a ComputedRef to 'options.freeze' in useSpring().
// These functions merely write to that ref
play()
pause()

// reset() can take a boolean argument for whether or not to freeze the spring after being reset.
// Simliarly doesn't work if you used a ComputedRef for 'options.freeze'
reset(true) // freeze the spring after reset
reset(false) // unfreeze the spring after reset
reset() // don't change the frozen state after reset

```

## Presets:

Taken from [React Spring](https://react-spring.io).

| Name       | Mass | Tension | Friction |
|------------|------|---------|----------|
| `default`  | 1    | 170     | 26       |
| `gentle`   | 1    | 120     | 14       |
| `wobbly`   | 1    | 180     | 12       |
| `stiff`    | 1    | 210     | 20       |
| `slow`     | 1    | 280     | 60       |
| `molasses` | 1    | 280     | 120      |
