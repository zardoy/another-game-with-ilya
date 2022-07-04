import { Gamepad, Keyboard, or as controlsOr } from 'contro'
import _ from 'lodash'

interface Config {}

// export const getKeyboardOrJoystickMovementContol = ({ }: Config) => {
const keyboard = new Keyboard()
const gamepad = new Gamepad()

const defaultControls = {
    general: {
        jump: 'Space A',
        inventory: 'E LB',
        crouch: 'Shift B',
        // todo fix joystick button (undefined values)
        // slowDown: "Control B"
    },
    special: {
        directionalKeys: keyboard.directionalKeys('wasd'),
    },
}

export const activeControls = {
    ..._.mapValues(defaultControls.general, val => {
        const [keyboardKey, gamepadButton] = val.split(' ')
        return controlsOr(keyboard.key(keyboardKey), gamepad.button(gamepadButton))
    }),
    ...{
        movement: controlsOr(defaultControls.special.directionalKeys, gamepad.stick('left')),
    },
}

//     return activeControls;
// };
