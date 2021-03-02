/* eslint-disable @typescript-eslint/no-explicit-any */
import nconf from "nconf";
import * as dotenv from "dotenv";

export interface IConfig {
  initialize(): void;
  get(key: string): any;
}

class Config implements IConfig {
  constructor() {
    dotenv.config(); //Loads the .env file into process.env
  }

  initialize(): void {
    nconf.env().file(`${process.cwd()}/config/default.json`);
    const connectionString = `mongodb://${nconf.get(
      "MONGODB_USERNAME"
    )}:${nconf.get("MONGODB_PASSWORD")}@${nconf.get(
      "DBHOSTNAME"
    )}:27017/${nconf.get("MONGODB_DATABASE")}`;

    this.set("database", {
      name: nconf.get("MONGODB_DATABASE"),
      connectionString,
    });

    this.set("frontendPort", nconf.get("FRONTEND_PORT"));
  }

  get(key: string): any {
    return nconf.get(key);
  }

  set(key: string, value: any): any {
    return nconf.set(key, value);
  }
}

export const config = new Config();
