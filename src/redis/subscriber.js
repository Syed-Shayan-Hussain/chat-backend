const redis = require("redis");

const redisSubscriber = redis.createClient();
redisSubscriber.connect();

module.exports = redisSubscriber;
