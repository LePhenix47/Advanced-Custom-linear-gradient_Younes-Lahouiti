import { log } from "./utils/functions/helper-functions/console.functions";

//Web components
import "./components/web-component.component";
import { ColorConverter } from "./utils/classes/services/color-converter-service.class";
import {
  parseToJS,
  stringifyToJSON,
} from "./utils/functions/helper-functions/string.functions";

// const colorConverter = new ColorConverter("hex", "#406273");

// const colorConverter = new ColorConverter("rgb", {
//   red: 64,
//   green: 98,
//   blue: 115,
// });

// const colorConverter = new ColorConverter("hsl", {
//   hue: 200,
//   saturation: 28,
//   lightness: 35,
// });

const colorConverter = new ColorConverter("hwb", {
  hue: 200,
  whiteness: 25,
  blackness: 55,
});

// const colorConverter = new ColorConverter("hsv", {
//   hue: 200,
//   saturation: 44,
//   value: 45,
// });

log("Color to convert:", colorConverter.color);
log(colorConverter.getAllColorModels());
