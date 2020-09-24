import { Event } from "./event";
import { HrTime } from "../common/time";

export interface TimedEvent extends Event {
  time: HrTime;
}
