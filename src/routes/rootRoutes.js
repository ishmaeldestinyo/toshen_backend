import userRouter from './userRoutes.js';
import projectRouter from './projectRoutes.js';
export default app => {
    app.use(userRouter);
    app.use("/api", projectRouter);
}