import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getBookings, makeBooking } from '../controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', makeBooking);

export { bookingRouter };