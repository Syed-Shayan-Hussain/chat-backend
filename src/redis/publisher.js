const redis = require("redis");

const redisPublisher = redis.createClient();
redisPublisher.connect();

module.exports = redisPublisher;
