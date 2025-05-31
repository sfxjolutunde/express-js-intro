import { createClient } from "redis";

const redisClient = createClient()

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
})
redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});
redisClient.connect().catch(console.error);

export default redisClient;