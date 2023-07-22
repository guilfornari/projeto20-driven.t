import { Booking } from "@prisma/client";
import { notFoundError } from "../../errors";
import bookingRepositories from "../../repositories/booking-repository";
import { BookingWithRooms } from "../../protocols";

async function getBookings(): Promise<BookingWithRooms[]> {

    const bookings = await bookingRepositories.getBookings()
    if (!bookings) throw notFoundError();

    return bookings;
}

const bookingService = { getBookings };

export default bookingService;