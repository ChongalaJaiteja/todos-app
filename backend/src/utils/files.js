const fs = require("fs");

const deleteFile = (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) {
        console.log("No file path provided, skipping deletion.");
        return;
    }
    fs.unlinkSync(filePath, (err) => {
        if (err) {
            console.error(
                `Failed to delete file at ${filePath}: ${err.message}`,
            );
        } else {
            console.log(`Successfully deleted file at ${filePath}`);
        }
    });
};

module.exports = { deleteFile };
