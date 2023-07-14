import { notFoundError } from '@/errors';
import hotelsRepositories from '../../repositories/hotels-repository';
import { Hotel } from '@prisma/client';

async function getHotels(): Promise<Hotel[]> {
    const hotelsList: Hotel[] = await hotelsRepositories.getHotels();
    if (!hotelsList) throw notFoundError();

    return hotelsList;
}

const hotelsService = { getHotels };

export default hotelsService;