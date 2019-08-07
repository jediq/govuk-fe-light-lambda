import cloneDeep from "lodash/cloneDeep";

import logger from "./util/logger";
import environment from "./util/environment";
import CryptoJS from "crypto-js";

var serviceConfig = process.env.npm_config_service || process.env.service || "../testservice";
logger.info("serviceConfig : " + serviceConfig);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const globalService = require(serviceConfig);

function hashCode(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export class Context {
    public service: any;
    public page: any;
    public data: any;

    public constructor(req: any) {
        this.service = cloneDeep(globalService);
        this.service.hash = hashCode(this.service.name);
        logger.debug("service hash : " + this.service.hash);
        if (!req) return;

        this.data = this.getDataFromReq(req);
        logger.debug("this.data after cookie : " + JSON.stringify(this.data));

        // add any form data into the context
        req.body && Object.keys(req.body).forEach(key => (this.data[key] = req.body[key]));
        logger.debug("this.data after fields: " + JSON.stringify(this.data));

        // create the page object
        const pageId = req.params["page"];
        logger.debug("looking in service for page : " + pageId);
        this.page = this.service.pages.find((page: any) => page.id === pageId);
        this.page && this.augmentPage();
    }

    private augmentPage() {
        for (var i = 0; i < this.page.items.length; i++) {
            var item = this.page.items[i];
            // Add dynamic options if specificed as a data entry
            if (item.options && !Array.isArray(item.options)) {
                console.log("context.data", this.data);
                console.log("[item.options] ", item.options);
                console.log("context.data[item.options] ", this.data[item.options]);
                item.options = this.data[item.options];
            }

            // Conflate date fields together
            if (item.type === "datePicker") {
                this.data[item.id] = this.data[item.id + "-day"] + " - " + this.data[item.id + "-month"] + " - " + this.data[item.id + "-year"];
            }
        }
    }

    public getEncodedData() {
        return this.encode(this.data, this.service.cookieSecret);
    }

    public getDataFromReq(req: any) {
        if (this.service.hash in req.cookies) {
            var encrypted = req.cookies[this.service.hash];
            logger.debug("encrypted cookie : " + encrypted);
            var decrypted = this.decode(encrypted, this.service.cookieSecret);
            logger.debug("decrypted cookie : " + decrypted);
            return decrypted;
        }
        return {};
    }

    public encode(obj: any, secret: string) {
        if (environment.debug) {
            return JSON.stringify(obj);
        }
        return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
    }

    public decode(str: string, secret: string) {
        if (environment.debug) {
            return JSON.parse(str);
        }
        var bytes = CryptoJS.AES.decrypt(str, secret);
        var asString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(asString);
    }

    public isValid() {
        if (!this.page) {
            logger.info("context invalid : no page found");
            return false;
        }

        if (!this.page.preRequisiteData) {
            return true;
        }
        logger.info(`page ${this.page.id} has pre-requisite data`);
        return this.page.preRequisiteData.every((key: string) => {
            logger.info(`key ${key} in data? ` + JSON.stringify(this.data));
            return key in this.data;
        });
    }
}
