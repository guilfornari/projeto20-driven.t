import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '../services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
    try {
        const bookings = await bookingService.getBookings();
        return res.status(httpStatus.OK).send(bookings[0]);
    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function makeBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const roomId = Number(req.body.roomId.toString());

    try {
        const booking = await bookingService.makeBooking(roomId, userId);
        return res.status(httpStatus.OK).send(booking.id);
    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
        if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}