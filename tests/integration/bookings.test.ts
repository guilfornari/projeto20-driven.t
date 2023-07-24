import supertest from "supertest";
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { createUser } from "../factories/users-factory";
import { createEnrollmentWithAddress, createFullRooms, createHotels, createRooms, createTicket, createTicketTypeCorrect, getHotelsToTest, getRooms } from "../factories";
import { createBookings } from "../factories/bookings-factory";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 200 and the expected object', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;
        await createBookings(user.id, roomId);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                Room: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }
            })
        );
    });

    it('should respond with status 404 when there is no booking', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 when not sending token', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;
        await createBookings(user.id, roomId);

        const response = await server.get('/booking');

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

});

describe('POST /booking', () => {

    it('should respond with status 200 and with the roomId', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;

        const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId });

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                bookingId: expect.any(Number)
            })
        );
    });

    it('should respond with status 404 when there is no ticket', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        await createTicketTypeCorrect();
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;

        const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId });

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when ticket is not paid', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;

        const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId });

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

});

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 200 and with the updated roomId', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;
        const booking = await createBookings(user.id, roomId);

        const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId });

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                bookingId: expect.any(Number)
            })
        );
    });

    it('should respond with status 403 and when room is full', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createFullRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;
        const booking = await createBookings(user.id, roomId);

        const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId });

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 and when the room does not exist', async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);
        const rooms = await getRooms();
        const roomId = rooms[0].id;
        const booking = await createBookings(user.id, roomId);

        const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: roomId + 2 });

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });


});