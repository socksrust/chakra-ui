import { cx } from "@chakra-ui/utils"
import { HTMLChakraProps, chakra, forwardRef } from "../styled-system"
import { useAlertContext, useAlertStyles } from "./alert-context"

export interface AlertDescriptionProps extends HTMLChakraProps<"div"> {}

export const AlertDescription = forwardRef<AlertDescriptionProps, "div">(
  function AlertDescription(props, ref) {
    const api = useAlertContext()
    const styles = useAlertStyles()

    return (
      <chakra.div
        ref={ref}
        data-status={api.status}
        {...props}
        className={cx("chakra-alert__desc", props.className)}
        css={[styles.description, props.css]}
      />
    )
  },
)

AlertDescription.displayName = "AlertDescription"
