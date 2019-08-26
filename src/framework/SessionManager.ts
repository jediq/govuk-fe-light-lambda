import express from "express";
import FrameworkService from "../types/framework";
import logger from "./util/logger";
import environment from "./util/environment";
import CryptoJS from "crypto-js";
import UUID from "uuid/v4";

const sessionIdKey = "_SESSION-ID_";

export class SessionManager {
  public loadSession(encryptedReference: string, service: FrameworkService) {
    logger.debug("encrypted reference : " + encryptedReference);
    var decryptedReference = this.decode(encryptedReference, service.cookieSecret);
    logger.debug("decrypted reference : " + decryptedReference);

    // TODO add external calls if necessary

    return decryptedReference;
  }

  public saveSession(data: any, service: FrameworkService) {
    if (!data[sessionIdKey]) {
      // TODO add session id here
      data[sessionIdKey] = UUID();
    }
    return this.encode(data, service.cookieSecret);
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
}
