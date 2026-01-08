'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'

interface Props {
  children: ReactNode
}

const store= makeStore()
export function Providers({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
