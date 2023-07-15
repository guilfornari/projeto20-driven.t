import { notFoundError } from '@/errors';
import hotelsRepositories from '../../repositories/hotels-repository';
import { Hotel } from '@prisma/client';
import ticketsRepository from '../../repositories/tickets-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import { notValidTicketError } from '../../errors/not-valid-ticket-error';
import { HotelWithRooms } from '../../protocols';

async function getHotels(userId: number): Promise<Hotel[]> {

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const userTicket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!userTicket) throw notFoundError();

    if (userTicket.TicketType.isRemote === true) throw notValidTicketError();
    if (userTicket.status === 'RESERVED') throw notValidTicketError();
    if (userTicket.TicketType.includesHotel === false) throw notValidTicketError();

    const hotelsList = await hotelsRepositories.getHotels();
    if (hotelsList.length === 0) throw notFoundError();

    return hotelsList;
}

async function getHotelById(userId: number, hotelId: number): Promise<Hotel> {

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const userTicket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!userTicket) throw notFoundError();

    if (userTicket.TicketType.isRemote === true) throw notValidTicketError();
    if (userTicket.status === 'RESERVED') throw notValidTicketError();
    if (userTicket.TicketType.includesHotel === false) throw notValidTicketError();

    const hotelWithRooms = await hotelsRepositories.getHotelById(hotelId);
    if (!hotelWithRooms) throw notFoundError();

    return hotelWithRooms;
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;