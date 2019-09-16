import FrameworkService from "../types/framework";
import logger from "./util/logger";
import fs from "fs";

export class ServiceManager {
  private services: FrameworkService[] = [];

  public constructor(location: string) {
    logger.debug("loading services from : " + location);
    logger.debug("current directory is : " + process.cwd());
    var serviceFileOrFolder: string = this.findServiceFileOrFolder(location);
    logger.debug("found service file or folder : " + serviceFileOrFolder);
    var fileOrFolderStat = fs.statSync(serviceFileOrFolder);
    var files: any[] = [];
    if (fileOrFolderStat.isDirectory()) {
      logger.debug("it's a directory, scanning");
      fs.readdirSync(serviceFileOrFolder).forEach(file => {
        logger.debug("inspecting file : " + file);
        if ((file.includes(".ts") || file.includes(".js")) && !file.includes(".test.")) {
          logger.debug(`Adding ${file} to potential service list`);
          files.push(location + "/" + file);
        }
      });
    } else {
      files.push(serviceFileOrFolder);
    }

    logger.debug(`Found ${files.length} potential service files`);

    for (var file of files) {
      file = this.jiggeryPokeyFilename(file);
      logger.debug(`loading service from ${file}`);
      var service = require(file).default;
      logger.info(`Loaded service : ${service.slug} (${service.name})`);
      this.services.push(service);
    }
  }

  private findServiceFileOrFolder(location: string): string {
    var existing: string = this.findExistingFileOrFolder(
      location,
      "src/" + location,
      "dist/" + location,
      location + ".ts",
      location + ".ts",
      "src/" + location + ".ts",
      "dist/" + location + ".ts"
    );
    return existing;
  }

  private findExistingFileOrFolder(...locations: string[]): string {
    for (var location of locations) {
      if (fs.existsSync(location)) {
        return location;
      }
    }
  }

  /*
  It looks for files in the src/dist folder, but 'require' is a little bit needy
  */
  private jiggeryPokeyFilename(file: string) {
    if (file.indexOf("src/") == 0) {
      file = file.substring(4);
    }
    file = file.substring(0, file.lastIndexOf(".ts"));
    if (file.indexOf("../") == -1) {
      file = "../" + file;
    }
    return file;
  }

  public getDefaultService(): FrameworkService {
    return this.services[0];
  }
  public getService(serviceName: any): FrameworkService {
    var service = this.services.find(service => service.slug == serviceName);
    if (service == undefined) {
      return this.getDefaultService();
    } else {
      return service;
    }
  }
  public getServices(): FrameworkService[] {
    return this.services;
  }
}
