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
    return prisma.booking.findMany({
        where: { roomId }
    });
}

async function updateBooking(roomId: number, bookingId: number) {
    return prisma.booking.update({
        where: { id: bookingId },
        data: { roomId }
    });
}

async function getBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        select: {
            id: true,
            userId: false,
            roomId: true,
            createdAt: false,
            updatedAt: false
        }
    });
}

const bookingRepositories = { getBookings, makeBooking, getBookingsByRoomId, updateBooking, getBookingByUserId };
export default bookingRepositories;