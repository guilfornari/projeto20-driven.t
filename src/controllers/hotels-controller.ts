import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '../services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const hotelsList = await hotelsService.getHotels(userId);
        return res.status(httpStatus.OK).send(hotelsList);
    } catch (error) {
        if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
        if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

        return res.sendStatus(httpStatus.NO_CONTENT);
    }
}