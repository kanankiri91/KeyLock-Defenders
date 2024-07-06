import jwt from "jsonwebtoken";
import Users from "../model/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Password salah" });

        // Tambahkan pengecekan status akun
        if (user.status === 0) {
            return res.status(403).json({ msg: "Akun anda di blokir" });
        }

        const userId = user.id;
        const name = user.fullname;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        const roleMsg = role === 1 ? "Anda login sebagai admin" : "Anda login sebagai user";

        res.json({ accessToken, msg: roleMsg });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);

        const users = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        const user = users[0];

        if(!user) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);

            const userId = user.id;
            const name = user.fullname;
            const email = user.email;
            const role = user.role;  // Menambahkan role
            const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const logOut = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const users = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    const user = users[0];

    if (!user) return res.sendStatus(204);

    const userId = user.id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    res.status(200).json({ msg: "Logout berhasil" });
};

