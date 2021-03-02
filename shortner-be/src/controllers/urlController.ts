import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { ShorteningService } from "../services/shorteningService";
import { unescape } from "../support/utils";
import { Url } from "../models/url";
const router = express.Router();

router.post(
  "/shorten",
  body("url")
    .trim()
    .isURL({
      protocols: ["http", "https", "ftp"],
      require_protocol: true,
      require_host: true,
      require_tld: false, //Support localhost
      require_valid_protocol: true,
      validate_length: true,
    })
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const service = new ShorteningService();
    service
      .shortenUrl(req.body.url)
      .then((document) => {
        res.status(200).send(document);
      })
      .catch((error) => {
        return next(error);
      });
  }
);

router.get("/full/:slug", (req: Request, res: Response, next: NextFunction) => {
  Url.findOne({ slug: req.params.slug })
    .then((result) => {
      return result
        ? res.status(200).send({ fullUrl: unescape(result.fullUrl) })
        : res.status(400).send({ message: "URL Not found" });
    })
    .catch((error) => {
      return next(error);
    });
});

export { router };
