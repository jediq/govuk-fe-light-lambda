import cloneDeep from "lodash/cloneDeep";
import express from "express";

import logger from "./util/logger";

import FrameworkService from "../types/framework";
import { SessionManager } from "./SessionManager";
import { ServiceManager } from "./ServiceManager";

var serviceConfig = process.env.npm_config_service || process.env.service || "examples/testservice";
logger.info("serviceConfig : " + serviceConfig);
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const globalService: FrameworkService = require("../" + serviceConfig).default;
const serviceManager: ServiceManager = new ServiceManager(serviceConfig);
const globalService: FrameworkService = serviceManager.getDefaultService();

const sessionManager: SessionManager = new SessionManager();

export class Context {
    public service: FrameworkService;

    public page: any;
    public data: any = {};

    public constructor(req: express.Request) {
        this.service = cloneDeep(serviceManager.getService(req && req.params["slug"]));

        this.service.hash = this.service.hash || this.hashCode(this.service.name);
        logger.debug(`service hash for ${this.service.name} is ${this.service.hash}`);
        if (!req) return;

        if (req.cookies && this.service.hash in req.cookies) {
            var encryptedReference: string = req.cookies[this.service.hash];
            this.data = sessionManager.loadSession(encryptedReference, this.service);
            logger.debug("this.data after cookie : " + JSON.stringify(this.data));
        }

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
                item.options = this.data[item.options];
            }

            // Conflate date fields together
            if (item.type === "datePicker") {
                this.data[item.id] = this.data[item.id + "-day"] + "-" + this.data[item.id + "-month"] + "-" + this.data[item.id + "-year"];
            }
        }
    }

    public isValid() {
        if (!this.page) {
            logger.info("context invalid : no page found");
            return false;
        }

        if (!this.page.preRequisiteData) {
            return true;
        }
        logger.info(`page ${this.page.id} has pre-requisite data: ` + JSON.stringify(this.page.preRequisiteData));
        return this.page.preRequisiteData.every((key: string) => {
            logger.info(`key ${key} in data? ` + JSON.stringify(this.data));
            return key in this.data;
        });
    }

    public getCookieData() {
        return sessionManager.saveSession(this.data, this.service);
    }

    private hashCode(str: string) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var character = str.charCodeAt(i);
            hash = (hash << 5) - hash + character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
