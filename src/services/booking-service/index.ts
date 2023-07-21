import { Booking } from "@prisma/client";
import { notFoundError } from "../../errors";
import bookingRepositories from "../../repositories/booking-repository";

async function getBookings(userId: number): Promise<Booking[]> {

    const bookings = await bookingRepositories.getBookings()
    if (bookings.length === 0) throw notFoundError();

    return bookings;
}

const bookingService = { getBookings };

export default bookingService;