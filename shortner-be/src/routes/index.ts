import { Express, Request, Response } from "express";

import { router as v1Router } from "./v1";
export class Router {
  private server: Express;

  constructor(server: Express) {
    this.server = server;
  }

  initialize(): void {
    this.server.use(`/api/v1`, v1Router);
    this.server.use("*", (req: Request, res: Response) => {
      res.status(501).send({
        message:
          "The service is running but the route you requested does not exist",
        method: req.method,
        url: req.originalUrl,
      });
    });
  }
}
