const asyncHandler = (fn) => async (request, response, next) => {
    try {
        await fn(request, response, next);
    } catch (error) {
        response.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    asyncHandler,
};
