import { prisma } from '@/config';
import { BookingParams, BookingWithRooms } from '../../protocols';
import { Booking } from '@prisma/client';

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
        where: { id: roomId }
    });
}

async function updateBooking(roomId: number, bookingId: number) {
    return prisma.booking.update({
        where: { id: bookingId },
        data: { roomId }
    });
}

async function getBookingsByUserId(userId: number): Promise<Booking> {
    return prisma.booking.findFirst({
        where: { userId }
    });
}

const bookingRepositories = { getBookings, makeBooking, getBookingsByRoomId, updateBooking, getBookingsByUserId };
export default bookingRepositories;