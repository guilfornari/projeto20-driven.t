import { notFoundError } from '@/errors';
import hotelsRepositories from '../../repositories/hotels-repository';
import { Hotel } from '@prisma/client';
import ticketsRepository from '../../repositories/tickets-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import { notValidTicketError } from '../../errors/not-valid-ticket-error';

async function getHotels(userId: number): Promise<Hotel[]> {

    const { id } = await enrollmentRepository.findWithAddressByUserId(userId);

    const userTicket = await ticketsRepository.findTicketByEnrollmentId(id);

    if (userTicket.TicketType.isRemote === true) throw notValidTicketError();
    if (userTicket.status === 'RESERVED') throw notValidTicketError()
    if (userTicket.TicketType.includesHotel === true) throw notValidTicketError();

    const hotelsList: Hotel[] = await hotelsRepositories.getHotels();
    if (!hotelsList) throw notFoundError();

    return hotelsList;
}

const hotelsService = { getHotels };

export default hotelsService;