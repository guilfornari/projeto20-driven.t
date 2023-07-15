import supertest from "supertest";
import app, { init } from "../../src/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import { prisma } from '@/config';
import {
    createEnrollmentWithAddress,
    createHotels,
    createRooms,
    createTicket,
    createTicketType,
    createTicketTypeCorrect,
    createTicketTypeNoHotel,
    createTicketTypeRemote,
    createUser,
    getHotelsToTest
} from "../factories";
import * as jwt from 'jsonwebtoken';
import { generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await prisma.hotel.deleteMany({});
});

const server = supertest(app);

describe("When getting the list off all the hotels", () => {

    it("Replies with status 401/Unauthorized when token is invalid?", async () => {

        const token = faker.lorem.word();
        const { status } = await server.get("/hotels").set('Authorization', `Bearer ${token}`);
        expect(status).toEqual(httpStatus.UNAUTHORIZED);

    });

    it("Replies with status 401/Unauthorized when token is not provided?", async () => {

        const { status } = await server.get("/hotels");
        expect(status).toEqual(httpStatus.UNAUTHORIZED);

    });

    it('Replies with status 401/Unauthorized if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('Replies with status 404/NotFound when given ticket does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('Replies with status 402/PaymentRequired when ticket has not been paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 402/PaymentRequired when ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 402/PaymentRequired when ticket does not includes hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeNoHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 404/NotFound when there are no hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('Replies with status 200/Ok and the list of hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createHotels();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            ])
        )
    });

});

describe("When getting a Hotel with its rooms", () => {

    it("Replies with status 401/Unauthorized when token is invalid?", async () => {

        const token = faker.lorem.word();
        const { status } = await server.get("/hotels/1").set('Authorization', `Bearer ${token}`);
        expect(status).toEqual(httpStatus.UNAUTHORIZED);

    });

    it('Replies with status 401/Unauthorized if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('Replies with status 401/Unauthorized if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it('Replies with status 404/NotFound when given ticket does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('Replies with status 404/NotFound when there are no hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('Replies with status 402/PaymentRequired when ticket has not been paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 402/PaymentRequired when ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 402/PaymentRequired when ticket does not includes hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeNoHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('Replies with status 200/Ok and a Hotel with a list of its rooms', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeCorrect();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createHotels();
        const hotels = await getHotelsToTest();
        const hotelId = hotels[0].id;
        await createRooms(hotelId);

        const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                Rooms: [
                    {
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                    {
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }
                ]
            }));
    });

});



