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
  confirmation: Confirmation;
  hash?: number;
}

interface Session {}

interface Page {
  id: string;
  description: string;
  nextPage: (context: Context) => string;
  preRequisiteData: Array<string>;
  items: Array<Item>;
  hint?: string;
  preValidation?: Array<HttpCall>;
  validation?: Validation;
}

interface Item {
  id: string;
  type: string;
  label: string;
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

interface Confirmation {
  description: string;
  preRequisiteData: Array<string>;
  groups: Array<Group>;
}

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
