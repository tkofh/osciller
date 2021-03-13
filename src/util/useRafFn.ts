import { onBeforeUnmount } from 'vue-demi'

export default function useRafFn(fn: () => void): void {
  let active = true
  const loop = () => {
    if (!active) return

    fn()

    window.requestAnimationFrame(loop)
  }

  loop()

  onBeforeUnmount(() => {
    active = false
  })
}
