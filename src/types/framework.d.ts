import { Context } from "../framework/Context";

export default class FrameworkService {
  name: string;
  slug: string;
  targetUrl: string;
  gdsPhase: string;
  firstPage: string;
  successMessage: string;
  failureMessage: string;
  cookieSecret: string;
  session?: Session;
  pages: Array<Page>;
  hash?: number;
}

interface Session {}

interface Page {
  id: string;
  nextPage: (context: Context) => string;
  preRequisiteData?: Array<string>;
  elements: Array<Element>;
  allElements?: Array<Element>;
  preValidation?: Array<HttpCall>;
  validation?: Validation;
  invalidElements?: Array<Element>;
}

interface Element {
  type: string;
  context?: Context;
  page?: Page;
  transformed?: any;
}

interface ContainerElement extends Element {
  elements: Array<Element>;
}

interface DisplayElement extends Element {}

interface ValueElement extends Element {
  name: string;
  displayText: string;
  shortText?: string;
  hint?: string;
  value?: string;
  validation?: Validation;
  valid?: boolean;
  invalid?: boolean;
}

interface FixedOptionValueElement extends Element {
  options: Array<object | string>;
  multiplicity?: boolean;
}

interface ElementTransformer {
  transform(element: Element): any;
}

interface Item {
  id: string;
  type: string;
  label?: string;
  hint?: string;
  validation?: Validation;
  options?: Array<string> | string;
  width?: string;
  placeholder?: string;
  value?: string;
}

interface BaseValidation {
  error: string;
}

interface RegexValidation extends BaseValidation {
  regex?: string;
}

interface FunctionValidation extends BaseValidation {
  validator?: (value: any) => boolean;
}

type Validation = RegexValidation | FunctionValidation;

interface Group {
  title: string;
  items: Array<any>;
  ancillary: Array<GroupAncillaryItem>;
}
interface GroupAncillaryItem {
  label: string;
  location: string;
}

interface HttpCall {
  id: string;
  url: string;
  debugUrl: string;
  headers: any;
  method?: string;
  bodySelector?: string; // dot notation selector used against context
  postProcess?: (data: any) => any;
}
