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

        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
        if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.FORBIDDEN);

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const roomId = Number(req.body.roomId.toString());
    const bookingId = Number(req.params.bookingId.toString());

    try {
        const booking = await bookingService.updateBooking(roomId, bookingId, userId);
        return res.status(httpStatus.OK).send(booking);

    } catch (error) {
        console.log(error);
        if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.FORBIDDEN);
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}