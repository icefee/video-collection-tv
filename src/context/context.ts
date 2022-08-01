import { createContext, Context } from 'react';

export function generateContext<T = any>(initValue: T): Context<T> {
    return createContext<T>(initValue);
}
