import { prisma } from '@/config';
import { BookingWithRooms } from '../../protocols';

async function getBookings(): Promise<BookingWithRooms[]> {
    return prisma.booking.findMany({
        select: {
            id: true,
            Room: true
        }
    });
}

const bookingRepositories = { getBookings };

export default bookingRepositories;