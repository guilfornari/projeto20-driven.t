import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

const hotelsRepositories = { getHotels };

export default hotelsRepositories;