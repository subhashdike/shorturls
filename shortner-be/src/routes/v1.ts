import express from "express";
import { router as urlController } from "../controllers/urlController";

const router = express.Router({ mergeParams: true });

router.use("/", urlController);

export { router };
