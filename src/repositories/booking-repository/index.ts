import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function getBookings(): Promise<Booking[]> {
    return prisma.booking.findMany({
        include: {
            Room: true
        }
    });
}

const bookingRepositories = { getBookings };

export default bookingRepositories;