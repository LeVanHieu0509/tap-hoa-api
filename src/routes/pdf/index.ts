import PdfController from "../../apps/controller/pdf.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.get("/pdf-gateway", asyncHandler(PdfController.getPdfGateWay));

export default router;
