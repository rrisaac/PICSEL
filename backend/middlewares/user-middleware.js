const { User } = require("../models/user.js");
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
    //middleware to verify user if its existing
    try {
        if (req.path === "/events" || req.path === "/change") {
            return next();
        }
        if (!req.cookies || !req.cookies.authToken) {
            return res.status(440).json({ error: "Unauthorized" });
        }

        const tokenPayload = jwt.verify(
            req.cookies.authToken,
            process.env.JWT_SECRET
        );
        const userId = tokenPayload.user_id;
        const user = await User.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(440).json({ error: "No user found." });
        }

        req.user = user;
        req.token = req.cookies.authToken;

        next();
    } catch (error) {
        console.error("Error verifying user", error);
        return res.status(500).json({ error: "Error verifying user" });
    }
};

module.exports = { verifyUser };
