import mongoose from 'mongoose';
import {config} from 'dotenv';
config();

export default async () => mongoose.connect(process.env.DB_URL)
.then(res => console.log("Database is connected"))
.catch(err => console.log(`Database Error occurred: ${err}`))