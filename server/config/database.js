import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbConnect = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST, // Menggunakan host dari Railway
  port: process.env.PGPORT, // Menggunakan port dari Railway
  username: process.env.PGUSER, // Menggunakan username dari Railway
  password: process.env.PGPASSWORD, // Menggunakan password dari Railway
  database: process.env.PGDATABASE, // Menggunakan nama database dari Railway
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Hanya perlu diubah jika Anda menggunakan SSL
    },
  },
});

export default dbConnect;
