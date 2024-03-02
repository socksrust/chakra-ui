import { VisuallyHidden } from "."

export default {
  title: "Disclosure / Visually Hidden",
}

export const hiddenSpan = () => (
  <VisuallyHidden>This is visually hidden</VisuallyHidden>
)

export const hiddenInput = () => (
  <VisuallyHidden asChild>
    <input type="checkbox" defaultChecked />
  </VisuallyHidden>
)
