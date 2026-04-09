import express, { type Request, type Response } from "express";
import AuthRouter from "./modules/auth/auth.routes.js";
import userRoute from "./modules/users/users.routes.js";
import spaceRoute from "./modules/spaces/spaces.routes.js";
import mapRoute from "./modules/maps/maps.routes.js";
import avatarRoute from "./modules/avatars/avatars.routes.js";
import adminRoute from "./modules/admin/admin.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import LiveKitRouter from "./modules/livekit/livekit.routes.js";
import { connectRedisPublisher } from "./redis/redis.js";


const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send("Server Running at 8080");
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH']
}))

app.use(cookieParser());

app.use(express.json());
app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            withCredentials: true,
        },
    })
);

app.use('/auth', AuthRouter);
app.use('/user', userRoute);
app.use('/spaces', spaceRoute);
app.use('/map', mapRoute);
app.use('/avatar', avatarRoute);
app.use('/admin',adminRoute);

app.use('/api/livekit', LiveKitRouter);


const start = async ()=>{
    await connectRedisPublisher();
    app.listen(8080,() => {
        console.log("Server Listining at 8080");
    })
}

start();