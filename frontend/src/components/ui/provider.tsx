"use client"

import React, { type PropsWithChildren } from "react"
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "./toaster"

export function CustomProvider(props: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ToastProvider>
        {props.children}
      </ToastProvider>
    </ThemeProvider>
  )
}
