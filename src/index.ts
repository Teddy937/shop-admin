require('dotenv').config();
import express from 'express'
import cors from 'cors'
import routes from './routes';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';

createConnection().then(connection => {
    const app = express();

    //handle requests as json
    app.use(express.json());

    //use cookies
    app.use(cookieParser());

    //allow frontend to use backend
    app.use(cors({
        credentials: true, // allows frontend to get cookie
        origin: ["http://localhost:3000"]
    }))

    app.use("/api", routes);

    app.listen(8000, () => {
        console.log('listening to port 8000');
    })
})

