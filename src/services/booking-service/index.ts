import { notFoundError } from "../../errors";
import bookingRepositories from "../../repositories/booking-repository";
import { BookingWithRooms } from "../../protocols";
import hotelsRepositories from "../../repositories/hotels-repository";
import enrollmentRepository from "../../repositories/enrollment-repository";
import ticketsRepository from "../../repositories/tickets-repository";
import { notValidTicketError } from "../../errors/not-valid-ticket-error";

async function getBookings(): Promise<BookingWithRooms[]> {

    const bookings = await bookingRepositories.getBookings()
    if (bookings.length === 0) throw notFoundError();

    return bookings;
}

async function makeBooking(roomId: number, userId: number) {

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const userTicket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!userTicket) throw notFoundError();

    if (userTicket.TicketType.isRemote === true) throw notValidTicketError();
    if (userTicket.status === 'RESERVED') throw notValidTicketError();
    if (userTicket.TicketType.includesHotel === false) throw notValidTicketError();

    const room = await hotelsRepositories.getRoomById(roomId);
    if (!room) throw notFoundError();

    const roomBookings = await bookingRepositories.getBookingsByRoomId(roomId);

    if (room.capacity === roomBookings.length) throw notValidTicketError();

    await bookingRepositories.makeBooking(roomId, userId);

    const booking = await bookingRepositories.getBookingsByUserId(userId);

    return booking;
}

async function updateBooking(roomId: number, bookingId: number, userId: number) {

    const userBooking = await bookingRepositories.getBookingsByUserId(userId);
    if (!userBooking) throw notValidTicketError();

    const room = await hotelsRepositories.getRoomById(roomId);
    if (!room) throw notFoundError();

    const roomBookings = await bookingRepositories.getBookingsByRoomId(roomId);
    if (room.capacity === roomBookings.length) throw notValidTicketError();

    await bookingRepositories.updateBooking(roomId, bookingId);

    const booking = await bookingRepositories.getBookingsByUserId(userId);

    return booking;
}

const bookingService = { getBookings, makeBooking, updateBooking };
export default bookingService;