import cloneDeep from "lodash/cloneDeep";
import express from "express";

import logger from "./util/logger";

import FrameworkService, { Page, Element, ContainerElement } from "../types/framework";
import { SessionManager } from "./SessionManager";
import { ServiceManager } from "./ServiceManager";

var serviceConfig = process.env.npm_config_service || process.env.service || "examples/testservice";
logger.info("serviceConfig : " + serviceConfig);

const serviceManager: ServiceManager = new ServiceManager(serviceConfig);
const globalService: FrameworkService = serviceManager.getDefaultService();

const sessionManager: SessionManager = new SessionManager();

export class Context {
  public service: FrameworkService;

  public page: any;
  public data: any = {};
  public allElements: Element[] = [];

  public constructor(req: express.Request) {
    this.service = cloneDeep(serviceManager.getService(req && req.params["slug"]));
    this.service.hash = this.service.hash || this.hashCode(this.service.name);
    this.service.pages.forEach(page => {
      var flat: Element[] = this.flattenElements(page.elements, page);
      page.allElements = flat;
      this.allElements.push(...flat);
    });

    logger.debug(`service hash for ${this.service.name} is ${this.service.hash}`);
    if (!req) return;

    if (req.cookies && this.service.hash in req.cookies) {
      var encryptedReference: string = req.cookies[this.service.hash];
      this.data = sessionManager.loadSession(encryptedReference, this.service);
      logger.debug("this.data after cookie : " + JSON.stringify(this.data));
    }

    // add any form data into the context
    req.body &&
      Object.keys(req.body).forEach(key => {
        logger.debug(`adding data for ${key} : ${req.body[key]}`);
        this.data[key] = req.body[key];
      });
    //logger.debug("this.data after fields: " + JSON.stringify(this.data));

    // create the page object
    const pageId = req.params["page"];
    logger.debug("looking in service for page : " + pageId);
    this.page = this.service.pages.find((page: any) => page.id === pageId);
    this.page && this.augmentPage();
  }

  private flattenElements(elements: Element[], page: Page) {
    const flat: Element[] = [];
    if (!elements) return flat;
    elements.forEach(item => {
      item.page = page;
      flat.push(item);
      if (Array.isArray((item as ContainerElement).elements)) {
        flat.push(...this.flattenElements((item as ContainerElement).elements, page));
      }
    });
    return flat;
  }

  private augmentPage() {
    logger.debug("augmenting page : " + JSON.stringify(this.page.allElements.length));

    //this.page.items && this.page.items.forEach(() => this.augmentItem);
    this.page.allElements && this.page.allElements.forEach((item: any) => this.augmentItem(item));
  }

  private augmentItem(item: any) {
    logger.debug(`Augmenting item : ${item.name} (${item.type}) = ${this.data[item.name]}`);
    if (item.options) {
      if (!Array.isArray(item.options)) {
        item.options = this.data[item.options];
        //logger.debug("Using dynamic options :  " + JSON.stringify(item.options));
      } else {
        //logger.debug("Using static options :  " + JSON.stringify(item.options));
      }

      if (typeof item.options[0] === "string") {
        for (var i = 0; i < item.options.length; i++) {
          item.options[i] = {
            text: item.options[i],
            value: item.options[i]
          };
        }
      }
      for (var option of item.options) {
        console.log(
          `this.data[item.name] (${this.data[item.name]}) = option.value (${option.value}) = ` +
            (this.data[item.name] && this.data[item.name].includes(option.value))
        );
        if (this.data[item.name] && this.data[item.name].includes(option.value)) {
          option.checked = true;
          option.selected = true;
        }
      }
    }

    // Conflate date fields together
    if ("DatePickerField" === item.type) {
      logger.debug("date picker : " + item.name);
      this.data[item.name] = this.data[item.name + "-day"] + "-" + this.data[item.name + "-month"] + "-" + this.data[item.name + "-year"];
      logger.debug("augmented date field : " + this.data[item.name]);
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
      logger.info(`key ${key} in data? ` + (key in this.data) + " - " + JSON.stringify(this.data));
      return key in this.data;
    });
  }

  public getDataForCookie() {
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
