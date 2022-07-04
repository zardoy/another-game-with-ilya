import create from 'zustand'
import { devtools } from 'zustand/middleware'

type BlockName = string

export const useWorldStore = create(
    devtools(() => ({
        blocks: new Map<[number, number, number], BlockName>(),
    })),
)
