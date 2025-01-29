const redis = require("redis");

const redisSubscriber = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
const redisPublisher = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
const redisQueueClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// Connect Redis clients
(async () => {
  await redisSubscriber.connect();
  await redisPublisher.connect();
  await redisQueueClient.connect();
  console.log("Redis clients connected successfully!");
})();

module.exports = { redisSubscriber, redisPublisher, redisQueueClient };
