import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from './config/database.js';
import SequelizeStore from "connect-session-sequelize";
import userRoute from "./routes/userRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import AdminRoute from "./routes/AdminRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: dbConnect
});

app.use(cors({
    origin: 'http://localhost:5173', // Mengambil BASE_URL dari .env
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
    credentials: true // Mengizinkan pengiriman cookies dalam permintaan
}));

app.use(express.json());
app.use(cookieParser());
app.use(userRoute);
app.use(AuthRoute);
app.use(AdminRoute);

// Mengatur header 'Access-Control-Allow-Credentials' menjadi 'true'
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log(`Server sedang berjalan di port ${process.env.APP_PORT}`);
});
