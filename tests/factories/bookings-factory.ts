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