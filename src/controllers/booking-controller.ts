import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '../services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
    try {
        const bookings = await bookingService.getBookings();
        return res.status(httpStatus.OK).send(bookings);
    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}