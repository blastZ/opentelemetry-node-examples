import { Attributes } from "./attributes";
import { LinkContext } from "./link_context";

export interface Link {
  context: LinkContext;
  attributes?: Attributes;
}
