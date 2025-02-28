import { Skeleton, SkeletonProps } from "./skeleton"

/**
 * `SkeletonCircle` is used to display the loading state in the form of a circular avatar.
 *
 * @see Docs https://chakra-ui.com/docs/components/skeleton
 */

export const SkeletonCircle: React.FC<SkeletonProps> = (props) => (
  <Skeleton borderRadius="full" boxSize="2rem" {...props} />
)

SkeletonCircle.displayName = "SkeletonCircle"
