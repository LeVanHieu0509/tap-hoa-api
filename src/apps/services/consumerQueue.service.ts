import { Channel } from "amqplib";
import {
  assertExChangePublishDirect,
  assertExChangeReceivedDirect,
  assertExchangePublish,
  assertExchangePublishTopic,
  assertExchangeReceived,
  connectToRabbitMQ,
  consumerQueue,
  consumerToQueueFailed,
  consumerToQueueNormal,
  producerToQueueNormal,
  runConsumerRabbitExchangeReceivedTopic,
} from "../../dbs/init.rabbitMQ";

const rabbitMQService = {
  consumerToQueue: async (queueName: any) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log("Error consumerToQueue", error);
    }
  },

  postVideo: async (msg, nameExchange) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await assertExchangePublish(channel, nameExchange, "fanout", msg);
      setTimeout(() => {
        connection.close();
      }, 2000);
      return 1;
    } catch (error) {
      console.log("Error assertExchange", error);
    }
  },

  receivedVideo: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const nameExchange = "video";
      return await assertExchangeReceived(channel, nameExchange, "fanout");
    } catch (error) {
      console.log("Error assertExchange", error);
    }
  },
  sendMail: async (msg, nameExchange, routingKey) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await assertExchangePublishTopic(
        channel,
        nameExchange,
        "topic",
        msg,
        routingKey
      );
      setTimeout(() => {
        connection.close();
      }, 2000);
      return 1;
    } catch (error) {
      console.log("Error assertExchange", error);
    }
  },
  receivedMail: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const nameExchange = "send-email";
      return await runConsumerRabbitExchangeReceivedTopic(
        channel,
        nameExchange,
        "topic"
      );
    } catch (error) {
      console.log("Error assertExchange", error);
    }
  },
  sendLog: async (msg, nameExchange, directKey) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const as = await assertExChangePublishDirect(
        channel,
        nameExchange,
        "direct",
        directKey,
        msg
      );

      setTimeout(function () {
        connection.close();
      }, 500);

      return as;
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
  receivedLog: async () => {
    try {
      const { channel } = await connectToRabbitMQ();
      const nameExchange = "send-log";

      return await assertExChangeReceivedDirect(
        channel,
        nameExchange,
        "direct"
      );
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
  handleNotiSendError: async (msg, nameExchange, directKey) => {
    try {
      //1 connect
      const { channel, connection } = await connectToRabbitMQ();

      return await producerToQueueNormal(
        channel,
        nameExchange,
        "direct",
        directKey,
        msg
      );
      //2
    } catch (error) {
      throw new Error("Error handleNotiSendError");
    }
  },
  handleReceivedQueueNomal: async () => {
    try {
      const { channel } = await connectToRabbitMQ();
      const nameExchange = "send-log";

      return await consumerToQueueNormal(channel, nameExchange, "direct");
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
  handleReceivedQueueFailed: async () => {
    try {
      const { channel } = await connectToRabbitMQ();
      const nameExchange = "send-log";

      return await consumerToQueueFailed(channel, nameExchange, "direct");
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
  //truong hop khong dung theo thu tu
  producerOrderedMessageNormal: async (msg, nameExchange, directKey) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const queueName = "oreder-queued-message";
      await channel.assertQueue(queueName, { durable: true });

      for (let i = 0; i < 10; i++) {
        const message = `${nameExchange} :: ${i}`;
        console.log("message:", message);

        await channel.sendToQueue(queueName, Buffer.from(message), {
          persistent: true,
        });
      }
      return true;
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
  consumerOrderedMessageNormal: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const queueName = "oreder-queued-message";
      await channel.assertQueue(queueName, { durable: true });

      //set prefetch (Xử lý theo tuần tự, giống như thêm await cho function)
      channel.prefetch(1); //set để đảm bảo xử lý theo tuần tự

      channel.consume(queueName, (msg) => {
        const message = msg.content.toString();

        //handle follow network không đi theo thứ tự
        setTimeout(() => {
          console.log("processed", message);
          channel.ack(msg);
        }, Math.random() * 1000);
      });
    } catch (error) {
      console.log("Error sendLog", error);
      throw new Error(error);
    }
  },
};

export default rabbitMQService;
