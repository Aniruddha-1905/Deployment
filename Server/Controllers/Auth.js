import users from "../Models/Auth.js"
import jwt from "jsonwebtoken"
export const login = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            try {
                const newUser = await users.create({ email });
                const token = jwt.sign({
                    email: newUser.email,
                    id: newUser._id
                }, process.env.JWT_SECERT, {
                    expiresIn: "1h"
                });
                res.status(200).json({ result: newUser, token });
            } catch (error) {
                res.status(500).json({ mess: error.message });
                return;
            }
        } else {
            const token = jwt.sign({
                email: existingUser.email,
                id: existingUser._id
            }, process.env.JWT_SECERT, {
                expiresIn: "1h"
            });
            res.status(200).json({ result: existingUser, token });
        }
    } catch (error) {
        res.status(500).json({ mess: error.message });
        return;
    }
}
