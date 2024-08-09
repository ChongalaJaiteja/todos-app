const { app } = require("./app");
require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 5001;
const connectDb = require("./db");
const redisClient = require("./utils/redisClient");

const startServer = async () => {
    try {
        await connectDb();
        await redisClient.connect();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
};

startServer();
