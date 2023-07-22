import supertest from "supertest";
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { createUser } from "../factories/users-factory";
import { createEnrollmentWithAddress, createHotels, createRooms, createTicket, createTicketTypeCorrect, getHotelsToTest, getRooms } from "../factories";
import { createBookings } from "../factories/bookings-factory";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /bookings', () => {
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
});

describe('POST /bookings', () => {
    it('should respond with status 200 and the with the created booking id', async () => {

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
            .send({ userId: user.id, roomId });
        console.log(response.body);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                roomId: expect.any(Number)
            })
        );
    });
});