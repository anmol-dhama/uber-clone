import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectToDb from './db/db';
import userRoute from '../src/routes/user.route';
import captainRoute from '../src/routes/captain.route';
import mapRoute from '../src/routes/maps.route';
import rideRoute from '../src/routes/ride.route';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json());

connectToDb();
app.use(cors());

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript!');
// });

app.use('/api/users', userRoute);
app.use('/api/captains', captainRoute);
app.use('/api/maps', mapRoute);
app.use('/api/rides', rideRoute);

export default app;