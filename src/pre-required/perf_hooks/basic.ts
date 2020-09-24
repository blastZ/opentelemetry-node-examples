import { performance } from "perf_hooks";
import { hrTime } from "../../source-code/core/common/time";

console.log(performance.timeOrigin);

console.log(performance.now());

console.log(`hrTime: ${hrTime()}, process.hrtime: ${process.hrtime()}`);
