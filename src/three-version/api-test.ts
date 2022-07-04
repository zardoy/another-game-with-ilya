import vec3 from '../shared/vec3'
import { placeBlock } from './api'

export const testApi = () => {
    placeBlock({
        block: 'stone',
        position: vec3(0, 15, 0),
    })
}
