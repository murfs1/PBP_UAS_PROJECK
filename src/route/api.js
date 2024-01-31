import express from "express";
import userController from "../controller/user-controller.js";
import perpusController from "../controller/perpus-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Perpustakaan API
userRouter.post('/api/perpustakaan', perpusController.create);
userRouter.get('/api/perpustakaan/:perpusId', perpusController.get);
userRouter.put('/api/perpustakaan/:perpusId', perpusController.update);
userRouter.delete('/api/perpustakaan/:perpusId', perpusController.remove);
userRouter.get('/api/perpustakaan', perpusController.search);

export {
    userRouter
}
