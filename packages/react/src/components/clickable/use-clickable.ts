import { mergeRefs } from "@chakra-ui/hooks"
import { dataAttr } from "@chakra-ui/utils"
import { useCallback, useState } from "react"
import { useEventListeners } from "./use-event-listeners"

export interface UseClickableProps {
  /**
   * If `true`, the element will be disabled.
   * It will set the `disabled` HTML attribute
   *
   * @default false
   */
  isDisabled?: boolean
  /**
   * If `true` and isDisabled, the element will
   * have only `aria-disabled` set to `true`
   *
   * @default false
   */
  isFocusable?: boolean
  /**
   * Whether or not trigger click on pressing `Enter`.
   *
   * @default true
   */
  clickOnEnter?: boolean
  /**
   * Whether or not trigger click on pressing `Space`.
   *
   * @default true
   */
  clickOnSpace?: boolean
  /**
   * The ref for the element
   */
  ref?: React.Ref<HTMLElement>
  [key: string]: any
}

function isValidElement(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const { tagName, isContentEditable } = element
  return (
    tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== true
  )
}

/**
 * useClickable implements all the interactions of a native `button`
 * component with support for making it focusable even if it is disabled.
 *
 * It can be used with both native button elements or other elements (like `div`).
 */
export function useClickable(props: UseClickableProps = {}) {
  const {
    ref: htmlRef,
    isDisabled,
    isFocusable,
    clickOnEnter = true,
    clickOnSpace = true,
    onMouseDown,
    onMouseUp,
    onClick,
    onKeyDown,
    onKeyUp,
    tabIndex: tabIndexProp,
    onMouseOver,
    onMouseLeave,
  } = props
  /**
   * We'll use this to track if the element is a button element
   */
  const [isButton, setIsButton] = useState(true)

  /**
   * For custom button implementation, we'll use this to track when
   * we mouse down on the button, to enable use style its ":active" style
   */
  const [isPressed, setIsPressed] = useState(false)

  const listeners = useEventListeners()

  /**
   * The ref callback that fires as soon as the dom node is ready
   */
  const refCallback = (node: any) => {
    if (!node) return
    if (node.tagName !== "BUTTON") {
      setIsButton(false)
    }
  }

  const tabIndex = isButton ? tabIndexProp : tabIndexProp || 0
  const trulyDisabled = isDisabled && !isFocusable

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      const self = event.currentTarget as HTMLElement
      self.focus()
      onClick?.(event)
    },
    [isDisabled, onClick],
  )

  const onDocumentKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (isPressed && isValidElement(e)) {
        e.preventDefault()
        e.stopPropagation()

        setIsPressed(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        listeners.remove(document, "keyup", onDocumentKeyUp, false)
      }
    },
    [isPressed, listeners],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event)

      if (isDisabled || event.defaultPrevented || event.metaKey) {
        return
      }

      if (!isValidElement(event.nativeEvent) || isButton) return

      const shouldClickOnEnter = clickOnEnter && event.key === "Enter"
      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(true)
      }

      if (shouldClickOnEnter) {
        event.preventDefault()
        const self = event.currentTarget as HTMLElement
        self.click()
      }

      listeners.add(document, "keyup", onDocumentKeyUp, false)
    },
    [
      isDisabled,
      isButton,
      onKeyDown,
      clickOnEnter,
      clickOnSpace,
      listeners,
      onDocumentKeyUp,
    ],
  )

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyUp?.(event)

      if (isDisabled || event.defaultPrevented || event.metaKey) return

      if (!isValidElement(event.nativeEvent) || isButton) return

      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(false)

        const self = event.currentTarget as HTMLElement
        self.click()
      }
    },
    [clickOnSpace, isButton, isDisabled, onKeyUp],
  )

  const onDocumentMouseUp = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return
      setIsPressed(false)
      listeners.remove(document, "mouseup", onDocumentMouseUp, false)
    },
    [listeners],
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.button !== 0) return

      if (isDisabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      if (!isButton) {
        setIsPressed(true)
      }

      const target = event.currentTarget as HTMLElement
      target.focus({ preventScroll: true })

      listeners.add(document, "mouseup", onDocumentMouseUp, false)

      onMouseDown?.(event)
    },
    [isDisabled, isButton, onMouseDown, listeners, onDocumentMouseUp],
  )

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.button !== 0) return

      if (!isButton) {
        setIsPressed(false)
      }

      onMouseUp?.(event)
    },
    [onMouseUp, isButton],
  )

  const handleMouseOver = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        event.preventDefault()
        return
      }

      onMouseOver?.(event)
    },
    [isDisabled, onMouseOver],
  )

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isPressed) {
        event.preventDefault()
        setIsPressed(false)
      }
      onMouseLeave?.(event)
    },
    [isPressed, onMouseLeave],
  )

  const ref = mergeRefs(htmlRef, refCallback)

  if (isButton) {
    return {
      ref,
      type: "button" as React.ButtonHTMLAttributes<any>["type"],
      "aria-disabled": trulyDisabled ? undefined : isDisabled,
      disabled: trulyDisabled,
      onClick: handleClick,
      onMouseDown,
      onMouseUp,
      onKeyUp,
      onKeyDown,
      onMouseOver,
      onMouseLeave,
    }
  }

  return {
    ref,
    role: "button",
    "data-active": dataAttr(isPressed),
    "aria-disabled": isDisabled ? ("true" as const) : undefined,
    tabIndex: trulyDisabled ? undefined : tabIndex,
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
    onMouseOver: handleMouseOver,
    onMouseLeave: handleMouseLeave,
  }
}

export type UseClickableReturn = ReturnType<typeof useClickable>
