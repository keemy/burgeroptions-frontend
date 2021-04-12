import { OpenOrders } from '@mithraic-labs/serum'
import React, { createContext, useContext, useState } from 'react'

type SerumOpenOrders = Record<string, OpenOrders[]>
type SerumOpenOrdersContext = [
  SerumOpenOrders,
  React.Dispatch<React.SetStateAction<SerumOpenOrders>>,
]

const SerumOpenOrdersContext = createContext<SerumOpenOrdersContext>([
  {},
  () => {},
])

export const SerumOpenOrdersProvider: React.FC = ({ children }) => {
  const openOrdersState = useState<SerumOpenOrders>({})

  return (
    <SerumOpenOrdersContext.Provider value={openOrdersState}>
      {children}
    </SerumOpenOrdersContext.Provider>
  )
}

export const useSerumOpenOrders = (): SerumOpenOrdersContext =>
  useContext(SerumOpenOrdersContext)