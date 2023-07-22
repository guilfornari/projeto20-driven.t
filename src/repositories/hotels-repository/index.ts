import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelById(hotelId: number): Promise<Hotel> {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      Rooms: true,
    }
  });
}

async function getRoomById(roomId: number): Promise<Room> {
  return prisma.room.findUnique({
    where: { id: roomId }
  });
}

const hotelsRepositories = { getHotels, getHotelById, getRoomById };

export default hotelsRepositories;
