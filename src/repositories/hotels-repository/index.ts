import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelWithRooms } from '../../protocols';

async function getHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function getHotelById(hotelId: number): Promise<Hotel> {
    return prisma.hotel.findUnique({
        where: { id: hotelId },
        include: {
            Rooms: true
        }
    });
}

const hotelsRepositories = { getHotels, getHotelById };

export default hotelsRepositories;