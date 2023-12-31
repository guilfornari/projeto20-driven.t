import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '../services/hotels-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotelsList = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotelsList);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId.toString());

  try {
    const hotelWithRooms = await hotelsService.getHotelById(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelWithRooms);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'NotValidTicketError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
