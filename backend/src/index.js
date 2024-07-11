const { app } = require("./app");
require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 4000;
const connectDb = require("./db");

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    });
