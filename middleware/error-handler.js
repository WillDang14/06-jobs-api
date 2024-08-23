const { CustomAPIError } = require("../errors");

const { StatusCodes } = require("http-status-codes");

//////////////////////////////////////////////////////
const errorHandlerMiddleware = (err, req, res, next) => {
    // console.log(err);

    // if (err instanceof CustomAPIError) {
    //     return res.status(err.statusCode).json({ msg: err.message });
    // }

    let customError = {
        // set default, nếu có err thì dùng statusCode của err
        // nếu không có thì dùng StatusCodes.INTERNAL_SERVER_ERROR
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,

        msg: err.message || "Something went wrong, try again later!",
    };

    // if (err instanceof CustomAPIError) {
    //     return res.status(err.statusCode).json({ msg: err.message });
    // }

    // Validation Error ==>> For checking Email and PW provided or not (in Register)
    if (err.name === "ValidationError") {
        // return array of objects
        // console.log(Object.values(err.errors));

        customError.msg = Object.values(err.errors)
            .map((item) => item.message) // this message is from Schema
            .join(",");

        customError.statusCode = 400; // bad request
    }

    // Duplicate Error ==>> same email address in DB
    if (err.code && err.code === 11000) {
        // Chú ý kĩ cái này (bài 194: Duplicate Error)
        // Object.keys() là lấy tên của "key" trong Object (không phải lấy value của key)
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value!`;

        customError.statusCode = 400; // bad request
    }

    // Cast Error ==>> báo lỗi khi ID không tìm thấy trong DB
    if (err.name === "CastError") {
        customError.msg = `No item found with id: ${err.value}`;

        customError.statusCode = 404; // Not Found
    }
    ////////////////////////////////////////////////
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    return res.status(customError.statusCode).json({ msg: customError.msg });
};

//////////////////////////////////////////////////////
module.exports = errorHandlerMiddleware;
