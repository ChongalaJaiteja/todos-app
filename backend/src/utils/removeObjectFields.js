const removeFieldsFromObject = (mongooseDoc, fieldsToRemove = []) => {
    if (!mongooseDoc || typeof mongooseDoc.toObject !== "function") {
        throw new Error("Invalid Mongoose document");
    }
    const plainObject = mongooseDoc.toObject();
    fieldsToRemove.forEach((field) => {
        delete plainObject[field];
    });

    return plainObject;
};

module.exports = {
    removeFieldsFromObject,
};
