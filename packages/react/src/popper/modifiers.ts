import { Modifier, Placement, State } from "@popperjs/core"
import { cssVars, getBoxShadow, toTransformOrigin } from "./utils"

/* -------------------------------------------------------------------------------------------------
 The match width modifier sets the popper width to match the reference.
 It is useful for custom selects, autocomplete, etc.
* -----------------------------------------------------------------------------------------------*/

export const matchWidth: Modifier<"matchWidth", any> = {
  name: "matchWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect:
    ({ state }) =>
    () => {
      const reference = state.elements.reference as HTMLElement
      state.elements.popper.style.width = `${reference.offsetWidth}px`
    },
}

/* -------------------------------------------------------------------------------------------------
  The transform origin modifier sets the css `transformOrigin` value of the popper
  based on the dynamic placement state of the popper.
  
  Useful when we need to animate/transition the popper.
* -----------------------------------------------------------------------------------------------*/

export const transformOrigin: Modifier<"transformOrigin", any> = {
  name: "transformOrigin",
  enabled: true,
  phase: "write",
  fn: ({ state }) => {
    setTransformOrigin(state)
  },
  effect:
    ({ state }) =>
    () => {
      setTransformOrigin(state)
    },
}

const setTransformOrigin = (state: State) => {
  state.elements.popper.style.setProperty(
    cssVars.transformOrigin.var,
    toTransformOrigin(state.placement),
  )
}

/* -------------------------------------------------------------------------------------------------
  The position arrow modifier adds width, height and overrides the `top/left/right/bottom`
  styles generated by popper.js to properly position the arrow
* -----------------------------------------------------------------------------------------------*/

export const positionArrow: Modifier<"positionArrow", any> = {
  name: "positionArrow",
  enabled: true,
  phase: "afterWrite",
  fn: ({ state }) => {
    setArrowStyles(state)
  },
}

const setArrowStyles = (state: Partial<State>) => {
  if (!state.placement) return
  const overrides = getArrowStyle(state.placement)

  if (state.elements?.arrow && overrides) {
    Object.assign(state.elements.arrow.style, {
      [overrides.property]: overrides.value,
      width: cssVars.arrowSize.varRef,
      height: cssVars.arrowSize.varRef,
      zIndex: -1,
    })

    const vars = {
      [cssVars.arrowSizeHalf
        .var]: `calc(${cssVars.arrowSize.varRef} / 2 - 1px)`,
      [cssVars.arrowOffset.var]: `calc(${cssVars.arrowSizeHalf.varRef} * -1)`,
    }

    for (const property in vars) {
      state.elements.arrow.style.setProperty(property, vars[property])
    }
  }
}

const getArrowStyle = (placement: Placement) => {
  if (placement.startsWith("top")) {
    return { property: "bottom", value: cssVars.arrowOffset.varRef }
  }
  if (placement.startsWith("bottom")) {
    return { property: "top", value: cssVars.arrowOffset.varRef }
  }
  if (placement.startsWith("left")) {
    return { property: "right", value: cssVars.arrowOffset.varRef }
  }
  if (placement.startsWith("right")) {
    return { property: "left", value: cssVars.arrowOffset.varRef }
  }
}

/* -------------------------------------------------------------------------------------------------
  The inner arrow modifier, sets the placement styles for the inner arrow that forms
  the popper arrow tip.
* -----------------------------------------------------------------------------------------------*/

export const innerArrow: Modifier<"innerArrow", any> = {
  name: "innerArrow",
  enabled: true,
  phase: "main",
  requires: ["arrow"],
  fn: ({ state }) => {
    setInnerArrowStyles(state)
  },
  effect:
    ({ state }) =>
    () => {
      setInnerArrowStyles(state)
    },
}

const setInnerArrowStyles = (state: State) => {
  if (!state.elements.arrow) return

  const inner = state.elements.arrow.querySelector(
    "[data-popper-arrow-inner]",
  ) as HTMLElement | null

  if (!inner) return
  const boxShadow = getBoxShadow(state.placement)
  if (boxShadow) {
    inner.style.setProperty("--popper-arrow-default-shadow", boxShadow)
  }

  Object.assign(inner.style, {
    transform: "rotate(45deg)",
    background: cssVars.arrowBg.varRef,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: "inherit",
    boxShadow: `var(--popper-arrow-shadow, var(--popper-arrow-default-shadow))`,
  })
}
