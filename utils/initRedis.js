// const util = require("util");
// const redis = require("redis");

// const client = redis.createClient({
//   port: 6379,
//   host: "redis-server",
//   // host: "redis",
//   // legacyMode: true,
// });
// (async () => {
//   client.connect();
// })();
// // client.on("error", (err) => {
// //   if (err) console.log("Redis Client Error", err);
// // });
// // client.on("connect", () => console.log("connected"));
// // client.on("ready", () => console.log("Redis ready..."));
// client.ping((err, message) => {
//   if (err) {
//     throw new Error("Error 💥");
//     return;
//   }
//   console.log(message);
// });
// // client.set("lastname", "jd", (err, res) => {
// //   console.log(res);
// // });
// client.set = util.promisify(client.set);
// client.get = util.promisify(client.get);
// module.exports = client;
