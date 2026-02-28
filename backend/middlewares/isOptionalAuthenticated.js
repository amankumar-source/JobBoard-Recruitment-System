import jwt from "jsonwebtoken";

/**
 * Optional Authentication Middleware
 * Checks for a JWT token but does not block the request if it is missing or invalid.
 * If a valid token is present, it attaches the `userId` to `req.id`.
 * This allows endpoints to support both guest users and authenticated users.
 */
const isOptionalAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next();
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if (decode) {
            req.id = decode.userId;
        }

        next();
    } catch (error) {
        // If token is expired or invalid, just proceed as an unauthenticated guest
        console.log("Optional Auth error ignored:", error.message);
        next();
    }
};

export default isOptionalAuthenticated;
