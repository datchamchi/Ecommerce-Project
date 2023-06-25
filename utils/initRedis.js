// const util = require("util");
const redis = require("redis");

const redisConfig = {
  port: "6379",
  host: "localhost"
};
const client = redis.createClient(redisConfig);

client.on("error", (err) => {
  console.error("Cannot connect with Redis", err);
});
client
  .connect()
  .then(() => {
    console.log("CONNECT REDIS SUCCESSFULLY");
  })
  .catch((err) => console.log(err));
client.ping().then((data) => console.log(data));
module.exports = client;
