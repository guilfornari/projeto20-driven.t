import { prisma } from '@/config';
import { BookingParams, BookingWithRooms } from '../../protocols';

async function getBookings(): Promise<BookingWithRooms[]> {
    return prisma.booking.findMany({
        select: {
            id: true,
            Room: true
        }
    });
}

async function makeBooking(roomId: number, userId: number) {
    const booking: BookingParams = { userId, roomId };
    return prisma.booking.create({
        data: booking
    });
}

async function getBookingsByRoomId(roomId: number) {
    return prisma.booking.count({
        where: { id: roomId }
    });
}

async function updateBooking(roomId: number, bookingId: number) {
    return prisma
}

const bookingRepositories = { getBookings, makeBooking, getBookingsByRoomId, updateBooking };
export default bookingRepositories;