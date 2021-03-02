import { NextFunction, Request, Response } from "express";
import { logger } from "../support";

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const errorId = logger.logError(
    `Error processing url: ${req.originalUrl}`,
    error
  );
  return res.status(500).send({ error: errorId });
};
