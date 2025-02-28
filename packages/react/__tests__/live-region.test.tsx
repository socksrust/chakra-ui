import { render } from "@chakra-ui/test-utils"
import * as React from "react"
import { LiveRegion, LiveRegionOptions } from "../src/components/live-region"

test("LiveRegion creates a container and has the proper aria and role attributes", () => {
  render(<div />)

  // eslint-disable-next-line no-new
  new LiveRegion()
  const region = document.getElementById("chakra-a11y-live-region")

  expect(region).toHaveAttribute("aria-atomic", "true")
  expect(region).toHaveAttribute("aria-live", "polite")
  expect(region).toHaveAttribute("aria-relevant", "all")
  expect(region).toHaveAttribute("role", "status")
})

test("LiveRegion creates a container using the provided options", () => {
  render(<div />)

  const options: LiveRegionOptions = {
    id: "some-id",
    role: "alert",
    "aria-live": "assertive",
    "aria-relevant": "removals",
    "aria-atomic": "false",
  }

  // eslint-disable-next-line no-new
  new LiveRegion(options)
  const region = document.getElementById("some-id")

  expect(region).toHaveAttribute("aria-atomic", "false")
  expect(region).toHaveAttribute("aria-live", "assertive")
  expect(region).toHaveAttribute("aria-relevant", "removals")
  expect(region).toHaveAttribute("role", "alert")
})

test('LiveRegion can "speak" by setting its text content', () => {
  render(<div />)

  const liveRegion = new LiveRegion()
  const region = document.getElementById(
    "chakra-a11y-live-region",
  ) as HTMLElement

  liveRegion.speak("Hello World")
  expect(region.innerText).toEqual("Hello World")
})
