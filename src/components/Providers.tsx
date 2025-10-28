"use client"

import { CustomerProvider } from "@/context/customer-context"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <CustomerProvider>{children}</CustomerProvider>
}