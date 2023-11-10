import { NextFunction } from "express";

import { SuccessResponse } from "../../core/success.response";
import { renderPdfGateWay } from "../services/pdf.service";

class PdfController {
  constructor(parameters) {}
  public static getPdfGateWay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "Logout Success",
        statusCode: 200,
        metadata: await renderPdfGateWay(req, res),
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PdfController;
