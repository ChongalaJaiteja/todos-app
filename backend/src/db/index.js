const mongoose = require("mongoose");
// const { DB_NAME } = require("../../constants");

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}`,
        );
        console.log(
            `\n Connected to database: ${connectionInstance.connection.host} \n`,
        );
    } catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
};

module.exports = connectDb;
