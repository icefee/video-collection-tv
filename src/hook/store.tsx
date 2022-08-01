import React, { useState, useContext } from 'react'
import { generateContext } from '../context/context'

type FocusKeyStore = {
    [key: string]: number;
}

type FocusKeyStoreContextProps = {
    focusStoreKeys: FocusKeyStore,
    setFocusStoreKey(key: string, value: number): void;
}

const FocusKeyStoreContext = generateContext<FocusKeyStoreContextProps | null>(null)

export function FocusKeyStoreProvider({ children }: { children: React.ReactChild }) {
    const [focusStoreKeys, setFocusStoreKeys] = useState<FocusKeyStore>({})
    return (
        <FocusKeyStoreContext.Provider value={{
            focusStoreKeys,
            setFocusStoreKey(key: string, value: number) {
                setFocusStoreKeys(
                    keys => ({
                        ...keys,
                        [key]: value
                    })
                )
            }
        }}>{children}</FocusKeyStoreContext.Provider>
    )
}

export function useFocusStoreKey(key: string): [number, (value: number) => void] {
    const context = useContext<FocusKeyStoreContextProps | null>(FocusKeyStoreContext)
    let focusKey = 0;
    if (context && context.focusStoreKeys[key] !== undefined) {
        focusKey = context.focusStoreKeys[key]
    }
    return [
        focusKey,
        (value: number) => context?.setFocusStoreKey(key, value)
    ]
}
