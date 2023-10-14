import { NextFunction, Response, Request } from "express";
import { SuccessResponse } from "../../../core/success.response";
import rabbitMQService from "../../services/consumerQueue.service";

class RabbitMQController {
  public static postVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { msg, nameExchange } = req.query;
    return new SuccessResponse({
      message: "Post notification video Success!",
      metadata: await rabbitMQService.postVideo(msg, nameExchange),
    }).send(res);
  };

  public static sendEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { msg, nameExchange, routingKey } = req.query;
    return new SuccessResponse({
      message: "SendMail Success!",
      metadata: await rabbitMQService.sendMail(msg, nameExchange, routingKey),
    }).send(res);
  };

  public static sendLog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { msg, nameExchange, directKey } = req.query;
    return new SuccessResponse({
      message: "Send Log Success!",
      metadata: await rabbitMQService.sendLog(msg, nameExchange, directKey),
    }).send(res);
  };

  public static handleNotiSendError = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { msg, nameExchange, directKey } = req.query;
    console.log("msg", msg);
    return new SuccessResponse({
      message: "Send Log Success!",
      metadata: await rabbitMQService.handleNotiSendError(
        msg,
        nameExchange,
        directKey
      ),
    }).send(res);
  };

  public static producerOrderedMessageNormal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { msg, nameExchange, directKey } = req.query;
    return new SuccessResponse({
      message: "Send Log Success!",
      metadata: await rabbitMQService.producerOrderedMessageNormal(
        msg,
        nameExchange,
        directKey
      ),
    }).send(res);
  };
}

export default RabbitMQController;
