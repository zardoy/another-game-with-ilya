import {Gamepad, Keyboard, or as controlsOr} from "../_snowpack/pkg/contro.js";
import _ from "../_snowpack/pkg/lodash.js";
const keyboard = new Keyboard();
const gamepad = new Gamepad();
const defaultControls = {
  general: {
    jump: "Space A",
    inventory: "E LB",
    crouch: "Shift B"
  },
  special: {
    directionalKeys: keyboard.directionalKeys("wasd")
  }
};
export const activeControls = {
  ..._.mapValues(defaultControls.general, (val) => {
    const [keyboardKey, gamepadButton] = val.split(" ");
    return controlsOr(keyboard.key(keyboardKey), gamepad.button(gamepadButton));
  }),
  ...{
    movement: controlsOr(defaultControls.special.directionalKeys, gamepad.stick("left"))
  }
};
