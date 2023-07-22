import { prisma } from "@/config";

export function createBookings(userId: number, roomId: number) {
    return prisma.booking.create({
        data:
        {
            userId,
            roomId
        }
    });
};

export function getBookingsTest(userId: number) {
    return prisma.booking.findFirst({
        where: { userId }
    });
};