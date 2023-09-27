import CSSConicGradient, {
  CSSConicGradientColorStop,
} from "@utils/classes/states/css-gradients/conic/css-conic.class";
import CSSLinearGradient, {
  CSSLinearGradientColorStop,
} from "@utils/classes/states/css-gradients/linear/css-linear.class";
import CSSRadialGradient, {
  CSSRadialGradientColorStop,
} from "@utils/classes/states/css-gradients/radial/css-radial.class";
import Gradient from "@utils/classes/states/index-gradients.class";
import SVGGradientBase from "@utils/classes/states/svg-gradients/class-base/svg-gradient-base.class";
import { SVGGradientColorStop } from "@utils/classes/states/svg-gradients/index-svg.class";
import SVGLinearGradient from "@utils/classes/states/svg-gradients/linear/svg-linear.class";
import SVGRadialGradient from "@utils/classes/states/svg-gradients/radial/svg-radial.class";
import { gradientInfos } from "@utils/variables/global-states/gradient-infos";

export function createCssGradient() {
  const { stopColors, type, options } = gradientInfos;
  switch (type) {
    case "linear": {
      return createCssLinearGradient();
    }
    case "radial": {
      return createCssRadialGradient();
    }
    case "conic": {
      return createCssConicGradient();
    }

    default:
      break;
  }
}

function createCssLinearGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { linear, radial, conic, common } = options.css;

  const linearGradients = new Gradient().create(
    "css",
    "linear"
  ) as CSSLinearGradient;

  linearGradients.setOrientation(linear.orientation);
  linearGradients.isRepeating = common.isRepeating;

  for (let i = 0; i < stopColors.length; i++) {
    const stopColor = stopColors[i] as CSSLinearGradientColorStop;

    const { color, id, opacity, offset } = stopColor;

    linearGradients.addStopColor({ color, id, opacity, offset });
  }

  return linearGradients.generateCssGradient();
}

function createCssRadialGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { linear, radial, conic, common } = options.css;

  const radialGradients = new Gradient().create(
    "css",
    "radial"
  ) as CSSRadialGradient;

  radialGradients.setPositionCoordinates({
    start: radial.x,
    end: radial.y,
  });

  radialGradients.setShape(radial.shape);

  radialGradients.setSize(radial.size);

  radialGradients.isRepeating = common.isRepeating;

  for (let i = 0; i < stopColors.length; i++) {
    const stopColor = stopColors[i] as CSSRadialGradientColorStop;

    const { color, id, opacity, offset } = stopColor;
    radialGradients.addStopColor({ color, id, opacity, offset });
  }

  return radialGradients.generateCssGradient();
}

function createCssConicGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { linear, radial, conic, common } = options.css;

  const conicGradients = new Gradient().create(
    "css",
    "conic"
  ) as CSSConicGradient;

  conicGradients.setOrientation(conic.orientation);

  conicGradients.setPositionCoordinates({
    start: conic.x,
    end: conic.y,
  });

  conicGradients.isRepeating = common.isRepeating;

  for (let i = 0; i < stopColors.length; i++) {
    const stopColor = stopColors[i] as CSSConicGradientColorStop;

    const { color, id, opacity, endAngle, startAngle, transitionAngle } =
      stopColor;
    conicGradients.addStopColor({
      color,
      id,
      opacity,
      endAngle,
      startAngle,
      transitionAngle,
    });
  }

  return conicGradients.generateCssGradient();
}

export function createSvgGradient() {
  const { stopColors, type, options } = gradientInfos;
  switch (type) {
    case "linear": {
      return createSvgLinearGradient();
    }
    case "radial": {
      return createSvgRadialGradient();
    }
    default:
      break;
  }
}

function createSvgLinearGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { linear, common } = options.svg;

  const linearGradients = new Gradient().create(
    "svg",
    "linear"
  ) as SVGLinearGradient;

  linearGradients.setOrientation(linear.orientation);

  linearGradients.setGradientTransform(common.transformFunctions);

  linearGradients.setGradientUnits(common.gradientUnits);

  linearGradients.setSpreadMethod(common.spreadMethod);

  for (let i = 0; i < stopColors.length; i++) {
    const stopColor = stopColors[i] as SVGGradientColorStop;

    linearGradients.addStopColor(stopColor);
  }

  const htmlSvgLinearGradient: string = linearGradients.generateSvgGradient();
  const reactNativeSvgLinearGradient: string = SVGGradientBase.toReactNativeSvg(
    htmlSvgLinearGradient
  );
  return {
    html: htmlSvgLinearGradient,
    reactNative: reactNativeSvgLinearGradient,
  };
}
function createSvgRadialGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { radial, common } = options.svg;

  const radialGradients = new Gradient().create(
    "svg",
    "radial"
  ) as SVGRadialGradient;

  radialGradients.setGradientTransform(common.transformFunctions);

  radialGradients.setGradientUnits(common.gradientUnits);

  radialGradients.setSpreadMethod(common.spreadMethod);

  radialGradients.setCenter(radial.centerX, radial.centerY);

  radialGradients.setRadius(radial.radius);

  radialGradients.setFocalPoint(radial.focalX, radial.focalY);

  radialGradients.setFocalRadius(radial.focalRadius);

  for (let i = 0; i < stopColors.length; i++) {
    const stopColor = stopColors[i] as SVGGradientColorStop;

    radialGradients.addStopColor(stopColor);
  }

  const htmlSvgLinearGradient: string = radialGradients.generateSvgGradient();
  const reactNativeSvgLinearGradient: string = SVGGradientBase.toReactNativeSvg(
    htmlSvgLinearGradient
  );

  return {
    html: htmlSvgLinearGradient,
    reactNative: reactNativeSvgLinearGradient,
  };
}

export function createCanvasGradient() {
  const { stopColors, type, options } = gradientInfos;
  switch (type) {
    case "linear": {
      return createCanvasLinearGradient();
    }
    case "radial": {
      return createCanvasRadialGradient();
    }
    case "conic": {
      return createCanvasConicGradient();
    }

    default:
      break;
  }
}

function createCanvasLinearGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { linear, common } = options.canvas;
}
function createCanvasRadialGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { radial, common } = options.canvas;
}
function createCanvasConicGradient() {
  const { stopColors, type, options } = gradientInfos;

  const { conic, common } = options.canvas;
}
