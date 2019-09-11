import { ElementTransformer } from "../../types/framework";

//import Transformer as GovukTransformer from "./GovukTransformer";

var transformers: any = [];
// eslint-disable-next-line @typescript-eslint/no-var-requires
transformers["govuk"] = require("./govuk/Transformer");
transformers["raw"] = require("./govuk/Transformer");

export class TransformerLoader {
    public getTransformer(renderer: string): ElementTransformer {
        return transformers[renderer];
    }
}
