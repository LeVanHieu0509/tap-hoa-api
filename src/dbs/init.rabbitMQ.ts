import { Channel, Connection } from "amqplib";

type typeExchange = "direct" | "topic" | "headers" | "fanout" | "match";

const amqp = require("amqplib");

const messages = "hello, RabittMq for hieu le 123";

// const log = console.log;
// console.log = function () {
//     log.apply(console, [new Date()])
// }

export const connectToRabbitMQ = async () => {
    try {
        const connection: Connection = await amqp.connect(
            "amqp://guest:12345@127.0.0.1"
        );
        if (!connection) throw new Error("Connection RabbitMQ Not Established");

        const channel: Channel = await connection.createChannel();

        return { channel, connection };
    } catch (error) {
        console.log("Error connect rabbitMQ", error);
    }
};

export const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        const queueName = "test-queue";
        await channel.assertQueue(queueName, {
            durable: true,
        });
        await channel.sendToQueue(queueName, Buffer.from(messages), {
            //time ti line, message này có hiệu lực là 10s, nếu như không có consumer nào nhận thì sẽ tự mất.
            expiration: "10000",
        });

        await connection.close();
    } catch (error) {
        console.log("Error connect rabbitMQ", error);
    }
};

export const consumerQueue = async (channel: Channel, queueName: string) => {
    try {
        //durable: Để catch lại data khi mà serve die.
        await channel.assertQueue(queueName, { durable: true });

        console.log("Waiting for messages...");
        channel.consume(
            queueName,
            (msg) => {
                console.log(`Received message ${queueName}::`, msg.content.toString());
                //1. find User following shop
                //2. Send message to user
                //3. yes, ok ==> success
                //4. error, setup DLX ....
            },
            {
                //False: Chưa được xử lý, nếu như có 1 consumer nào vào lắng nghe thì nó vẫn
                //sẽ nhận được msg này để xử lý
                // True: status untracked = 0 và trong hàng đợi sẽ không còn.

                //Giải thích thêm: Nếu consumer xác nhận là đã nhận rồi thì noACK == true để rabbitMQ hiểu rằng là consumer đã nhận rồi
                // và sẽ xoá đi trong hàng đợi, để lần sau ko gửi được nữa.

                //Ngược lại: Nếu mà == false, hiểu là consumer này chưa xử lý được tác vụ nên sẽ chuyển sang consumer khác để tiếp tục xử lý, Khi nào xử lý được thì thôi
                noAck: true, //Nếu bị lỗi thì phải xử xử lý như thế nào. => Khi có hàng nghìn email gửi đi nhưng mà lỗi 100 email, phải xử lý qua một luồng khác, quay trở lại 1 hàng đợi khác để xử lý auto
            }
        );
    } catch (error) {
        console.log("consumerQueue", error);
        throw new Error(error);
    }
};

//-----------------------------------------------------------------------------       EXCHANGE FANOUT       --------------------------------------------------------------------------------------
// Chỉ có khả năng phát sóng một cách vô thức.

export const assertExchangePublish = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange,
    msg
) => {
    try {
        //1. Ai muốn nhận thì cứ nhận.
        await channel.assertExchange(nameExchange, type, {
            durable: true,
        });
        console.log(`[x] Send OK::: ${msg}`);

        return await channel.publish(nameExchange, "", Buffer.from(msg));
    } catch (error) {
        console.log("assertExchange", error);
        throw new Error(error);
    }
};

export const assertExchangeReceived = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange
) => {
    try {
        //1. Ai muốn nhận thì cứ nhận.
        await channel.assertExchange(nameExchange, type, {
            durable: true,
        });

        //create queue
        const { queue } = await channel.assertQueue("", {
            exclusive: true, //Khi mà user ko đăng kí nữa thì sẽ xoá đi trong hàng đợi.
        });

        console.log("Message Queue: ", queue);

        //binding
        await channel.bindQueue(queue, nameExchange, "");

        await channel.consume(
            queue,
            (msg) => {
                console.log("msg received:: ", msg.content.toString());
            },
            {
                noAck: true,
            }
        );
    } catch (error) {
        console.log("Error is assertExchangeReceived", error);
        throw new Error(error);
    }
};

//-----------------------------------------------------------------------------       TOPIC        --------------------------------------------------------------------------------------

export const assertExchangePublishTopic = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange,
    msg,
    routingKey
) => {
    try {
        //1. Ai muốn nhận thì cứ nhận.
        await channel.assertExchange(nameExchange, type, {
            durable: true,
        });

        console.log(`msg::${msg} ::::: topic:: ${routingKey}`);

        return await channel.publish(nameExchange, routingKey, Buffer.from(msg));
    } catch (error) {
        console.log("Error AssertExchangePublishTopic", error);
        throw new Error(error);
    }
};

export const runConsumerRabbitExchangeReceivedTopic = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange
) => {
    try {
        await channel.assertExchange(nameExchange, type, {
            durable: true,
        });

        const { queue } = await channel.assertQueue("", {
            exclusive: true, //Khi mà user ko đăng kí nữa thì sẽ xoá đi trong hàng đợi.
        });

        //Khi mà pushlish vào 1 trong nhưng routingKey này thì consumer sẽ nhận được.
        // Giống như là các phòng ban đăng kí một routingKey
        // Dựa vào routing key này thì hệ thống rabbitMQ có thể gửi mail tới một địa chỉ cụ thể
        const routingKey = ["#.lead", "*.test.*", "dev.*.*"];

        console.log(`waiting queue ${queue}::: topic:: ${routingKey}`);

        routingKey.forEach(async (key) => {
            await channel.bindQueue(queue, nameExchange, key);
        });

        return await channel.consume(
            queue,
            (msg) => {
                console.log(
                    `Routing key::  ${msg.fields.routingKey
                    } ::: msg ::: ${msg.content.toString()}`
                );
            },
            {
                noAck: true,
            }
        );
    } catch (error) {
        console.log("error runConsumerRabbitExchangeReceivedTopic", error);
    }
};

//-----------------------------------------------------------------------------      DIRECT        --------------------------------------------------------------------------------------
// Cho phép lọc tin nhắn dựa trên mức độ nghiêm trọng
// Một tin nhắn đi đến hàng đợi có khóa liên kết (publish) khớp chính xác với khóa định tuyến (bindQueue) của tin nhắn.

export const assertExChangePublishDirect = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange,
    directKey: string,
    msg: string
) => {
    await channel.assertExchange(nameExchange, type, {
        durable: false,
    });

    const result = await channel.publish(
        nameExchange,
        directKey ?? "info",
        Buffer.from(msg)
    );
    console.log(
        `SEND: msg::${msg} ::::: directKey:: ${directKey} ::: in nameExchange: ${nameExchange}`
    );

    return result;
};

export const assertExChangeReceivedDirect = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange
) => {
    await channel.assertExchange(nameExchange, type, {
        durable: false,
    });

    const { queue } = await channel.assertQueue("", {
        exclusive: true,
    });
    const directKey = ["info", "error", "waring"];

    console.log(`waiting queue ${queue}::: topic:: ${directKey}`);

    directKey.forEach(async (element) => {
        await channel.bindQueue(queue, nameExchange, element);
    });

    return await channel.consume(
        queue,
        (msg) => {
            console.log(
                `Received with Direct key::  ${msg.fields.routingKey
                } ::: msg ::: ${msg.content.toString()}`
            );
        },
        {
            noAck: true,
        }
    );
};

export const producerToQueueNormal = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange,
    directKey: string,
    msg: string
) => {
    //1. Gửi được nhưng mà bị lỗi và đưa message lỗi vào trong trong 1 exchange khác để xử lý những cái hot fix
    let notificationExchange = "notificationEx";
    let notiQueue = "notificationQueueProcess";
    let notificationExchangeDLX = "notificationExchangeDLX";
    let notificationRoutingKeyDLX = "notificationExchangeDLX";

    //2. sẽ tạo ra một exchange có type là direct, và được lưu ở trong messageMQ
    await channel.assertExchange(notificationExchange, type, {
        durable: true,
    });

    //3. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
        exclusive: false, //cho phép các kết nối truy cập được vào hàng đợi.
        deadLetterExchange: notificationExchangeDLX, //Nếu message bị lỗi hay bị bất cứ vấn đề gì thì exchange này sẽ nhận được
        deadLetterRoutingKey: notificationRoutingKeyDLX, //với bộ định tuyến này.
    });

    //4. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange, "");

    return await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
        //time ti line, message này có hiệu lực là 10s, nếu như không có consumer nào nhận thì sẽ tự mất.
        expiration: "10000",
    });
};

export const consumerToQueueNormal = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange
) => {
    const queueName = "notificationQueueProcess";
    console.log("waiting queue", queueName);

    //giả sự bị lỗi khi gửi noti.
    //Nếu có lỗi ở trong đây thì sẽ nhaỷ vào DLX luôn
    // Còn nếu như mà ko lỗi => Xử lý logic mới lỗi thì sẽ sử dụng try catch và đẩy lỗi qua hàng đợi lỗi bằng phương thức nack

    return await channel.consume(queueName, (msg) => {
        try {
            const numberTest = Math.random();
            console.log({ numberTest });

            if (numberTest < 0.8) {
                throw new Error("Send Noti Failed:: HOT FIX");
            }
            console.log("RECEIVED NOTIFICATION: ", msg.content.toString());

            channel.ack(msg);

        } catch (error) {
            // console.log("RECEIVED NOTIFICATION ERROR: ", error);
            channel.nack(msg, false, false)
        }

    });
};

export const consumerToQueueFailed = async (
    channel: Channel,
    nameExchange: string,
    type: typeExchange
) => {
    //1.
    let notificationExchangeDLX = "notificationExchangeDLX";
    let notificationRoutingKeyDLX = "notificationExchangeDLX";
    let notiQueueHotfix = "notiQueueHotfix";

    console.log("waiting queue", notiQueueHotfix);
    await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
    });

    const { queue } = await channel.assertQueue(notiQueueHotfix, {
        exclusive: false,
    });

    await channel.bindQueue(
        queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
    );

    await channel.consume(queue, (msg) => {
        console.log(
            "this notification hot fix error error: ",
            msg.content.toString()
        );
    });
};
