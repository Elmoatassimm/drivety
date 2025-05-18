// Import dependencies
import { Router } from 'express';
import { container } from './config/container';

// Import module routes
import authRouter from './modules/auth/auth.routes';
import { UserRouter } from './modules/user/user.routes';
import { DriverRouter } from './modules/driver/driver.routes';
import { VehicleRouter } from './modules/vehicle/vehicle.routes';
import { ComponentRouter } from './modules/component/component.routes';
import { TripRouter } from './modules/trip/trip.routes';

// Create router instance
const router = Router();

// Register Auth routes
router.use('/api/auth', authRouter);

// Register User routes
const userRouter = container.resolve(UserRouter);
router.use('/api/users', userRouter.getRouter());

// Register Driver routes
const driverRouter = container.resolve(DriverRouter);
router.use('/api/drivers', driverRouter.getRouter());

// Register Vehicle routes
const vehicleRouter = container.resolve(VehicleRouter);
router.use('/api/vehicles', vehicleRouter.getRouter());

// Register Component routes
const componentRouter = container.resolve(ComponentRouter);
router.use('/api/components', componentRouter.getRouter());

// Register Trip routes
const tripRouter = container.resolve(TripRouter);
router.use('/api/trips', tripRouter.getRouter());

export default router;