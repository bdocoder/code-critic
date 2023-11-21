"use client";

import { useLayoutEffect } from "react";

/**
 * A component that logs a message once it is rendered
 *
 * DT is for DevTools
 */
export default function DTLogger() {
  useLayoutEffect(() => {
    console.log(
      "Check out the README.md file at https://github.com/bdocoder/code-critic"
    );
  }, []);
  return null;
}
