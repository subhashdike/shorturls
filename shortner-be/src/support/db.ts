import mongoose from "mongoose";
import { IConfig } from "./config";
import { logger } from "./logger";

class MyMongoose {
  private defaultOptions: mongoose.ConnectOptions;
  private config!: IConfig;
  private reconnectAttempts = 3;
  constructor(config: IConfig) {
    this.config = config;
    this.defaultOptions = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dbConfig = this.config.get("database");
      const options =
        typeof dbConfig.options === "object" &&
        Object.keys(dbConfig.options).length
          ? Object.assign(this.defaultOptions, dbConfig.options)
          : this.defaultOptions;

      console.log(`Connecting to database ${dbConfig.name}`);
      this.addConnectionEvents();
      mongoose
        .connect(dbConfig.connectionString, options)
        .then(() => {
          resolve(true);
        })
        .catch((err: Error) => {
          if (this.reconnectAttempts > 0) {
            console.log(`Retry Connecting to database ${dbConfig.name}`);
            this.reconnectAttempts--;
            return this.connect();
          } else {
            logger.logError(
              `Error connecting to database ${dbConfig.name}`,
              err
            );
            reject(err);
          }
        });
    });
  }

  private addConnectionEvents() {
    mongoose.connection.on("disconnected", () => {
      logger.logError(`Database ${mongoose.connection.name} disconnected`, {
        event: "MONGO_DISCONNECTED",
        hostName: mongoose.connection.host,
        port: mongoose.connection.port,
      });
    });
    mongoose.connection.on("reconnected", () => {
      logger.logInfo(`Database ${mongoose.connection.name} is reconnected`, {
        event: "MONGO_RECONNECTED",
        hostName: mongoose.connection.host,
        port: mongoose.connection.port,
      });
    });
    mongoose.connection.on("connected", () => {
      logger.logInfo(`Database ${mongoose.connection.name} is connected`, {
        event: "MONGO_CONNECTED",
        hostName: mongoose.connection.host,
        port: mongoose.connection.port,
      });
    });
  }
}

export { MyMongoose };
