import { useWorldStore } from './worldStore'

const { setState: setWorldState } = useWorldStore

type PlaceBlock = (data: { position: [number, number, number]; block: 'dirt' | 'stone' }) => void
export const placeBlock: PlaceBlock = ({ block, position }) => {
    useWorldStore.setState(({ blocks }) => ({ blocks: blocks.set(position, block) }))
}
