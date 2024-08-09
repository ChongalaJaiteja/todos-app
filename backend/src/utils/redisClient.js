const redis = require("redis");

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT,
    },
});

client.on("connect", () => {
    console.log("Connected to redis instance!");
});

module.exports = client;
