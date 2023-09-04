console.log("Hello world");
console.log("Hello world");

import "@components/index.components";

import { selectQuery } from "@utils/functions/helper-functions/dom.functions";
import { log } from "@utils/functions/helper-functions/console.functions";

const svg = selectQuery<SVGElement>("svg");
