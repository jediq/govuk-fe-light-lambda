import { Context } from "./Context";
import { HttpCall } from "../types/framework";
import logger from "./util/logger";
import environment from "./util/environment";
import * as handlebars from "handlebars";
import got from "got";

export class HttpCallout {
  public async call(call: HttpCall, context: Context) {
    var urlTemplate = handlebars.compile(!environment.debug ? call.url : call.debugUrl);
    var url = urlTemplate({ context });
    logger.info("calling preValidation url : " + url);
    var response = "";
    if (call.method == "POST") {
      var body = _.get(context, call.bodySelector);
      response = await this.makePostCall(url, body);
    } else {
      response = await this.makeGetCall(url);
    }

    logger.debug("response.body : " + response);
    response = JSON.parse(response);

    if (call.postProcess) {
      response = call.postProcess(response);
    }

    return response;
  }

  private async makeGetCall(url: string) {
    return (await got(url)).body;
  }

  private async makePostCall(url: string, body: any) {
    return (await got(url)).body;
  }
}
