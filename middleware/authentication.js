const User = require("../models/User");

const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

////////////////////////////////////////////////////////
const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Authentication Invalid!");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name };

        next();
    } catch (error) {
        // console.log(error);

        // Cách 1: Báo lỗi Expired token
        // if (error instanceof jwt.TokenExpiredError) {
        //     // console.log(jwt.TokenExpiredError);

        //     // console.log(error.message);
        //     // console.log(error.name);
        //     // console.log(error.expiredAt);

        //     throw new UnauthenticatedError("Authentication Expired!");
        // }

        // Cách 2: Báo lỗi Expired token
        // if (error.name === "TokenExpiredError") {
        //     console.log(error.expiredAt);
        //     throw new UnauthenticatedError("Authentication Expired!");
        // }

        // Cách 3 ngắn gọn hơn
        // ví dụ ở đây ==>> https://www.youtube.com/watch?v=NxANrLx59Cc
        const msg =
            error.name === "TokenExpiredError"
                ? "Authentication Expired!"
                : "Authentication Invalid!";

        // throw new UnauthenticatedError("Authentication Invalid!");
        throw new UnauthenticatedError(msg);
    }
};

////////////////////////////////////////////////////////
module.exports = auth;
