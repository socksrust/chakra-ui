import { cx, dataAttr } from "@chakra-ui/utils"
import {
  HTMLChakraProps,
  SystemRecipeProps,
  chakra,
  forwardRef,
  useRecipe,
} from "../styled-system"
import { useButtonGroup } from "./button-context"
import { ButtonOptions } from "./button-types"

export interface ButtonProps
  extends HTMLChakraProps<"button">,
    ButtonOptions,
    SystemRecipeProps<"Button"> {}

/**
 * Button component is used to trigger an action or event, such as submitting a form, opening a Dialog, canceling an action, or performing a delete operation.
 *
 * @see Docs https://chakra-ui.com/docs/components/button
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const Button = forwardRef<ButtonProps, "button">(
  function Button(props, ref) {
    const group = useButtonGroup()

    const recipe = useRecipe("Button")
    const [variantProps, localProps] = recipe.splitVariantProps(props)
    const styles = recipe({ ...group, ...variantProps })

    const {
      isDisabled = group?.isDisabled,
      isActive,
      type,
      className,
      as,
      ...rest
    } = localProps

    return (
      <chakra.button
        ref={ref}
        as={as}
        type="button"
        data-in-group={dataAttr(!!group)}
        data-active={dataAttr(isActive)}
        css={styles}
        disabled={isDisabled}
        {...rest}
        className={cx("chakra-button", className)}
      />
    )
  },
)

Button.displayName = "Button"
