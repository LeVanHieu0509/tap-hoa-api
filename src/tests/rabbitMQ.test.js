const {connectToRabbitMQForTest} = require('../dbs/init.rabbitMQ')

describe('Beverage()', () => {
  it("Should Connection to Success RabbitMQ", async () => {
    const result = await connectToRabbitMQForTest()
    expect(result).toBeUndefined();
  })
});