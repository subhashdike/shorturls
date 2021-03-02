import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config, logger, MyMongoose } from "./support";
import { Router } from "./routes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
config.initialize();
const corsOptions = {
  origin: `http://${config.get("FRONTEND_HOST_NAME")}:${config.get(
    "frontendPort"
  )}`,
};
app.use(cors(corsOptions));
logger.initialize(config);
const router = new Router(app);
router.initialize();
app.use(errorHandlerMiddleware);
const myDatabase = new MyMongoose(config);
myDatabase
  .connect()
  .then(() => {
    const port = config.get("BACKEND_PORT");

    app.listen(port, () => {
      logger.logInfo(`The application is listening on port ${port}!`);
    });
  })
  .catch((error) => {
    logger.logError("Error Connecting to database", error);
  });
