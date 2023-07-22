import { Router } from 'express';
import { authenticateToken } from '../middlewares';
import { getBookings, makeBooking, updateBooking } from '../controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', makeBooking)
    .put('/:bookingId', updateBooking);

export { bookingRouter };