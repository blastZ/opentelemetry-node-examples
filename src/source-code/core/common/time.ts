import * as api from "../../api";
import { otperformance as performance } from "../platform";

const NANOSECOND_DIGITS = 9;
const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);

function getTimeOrigin(): number {
  let timeOrigin = performance.timeOrigin;

  return timeOrigin;
}

function numberToHrtime(epochMillis: number): api.HrTime {
  const epochSeconds = epochMillis / 1000;
  const seconds = Math.trunc(epochSeconds);
  const nanos =
    Number((epochSeconds - seconds).toFixed(NANOSECOND_DIGITS)) *
    SECOND_TO_NANOSECONDS;
  return [seconds, nanos];
}

export function hrTime(performanceNow?: number): api.HrTime {
  const timeOrigin = numberToHrtime(getTimeOrigin());
  const now = numberToHrtime(
    typeof performanceNow === "number" ? performanceNow : performance.now()
  );

  let seconds = timeOrigin[0] + now[0];
  let nanos = timeOrigin[1] + now[1];

  if (nanos > SECOND_TO_NANOSECONDS) {
    nanos -= SECOND_TO_NANOSECONDS;
    seconds += 1;
  }

  return [seconds, nanos];
}
