import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createTicketTypeRemote() {
    return prisma.ticketType.create({
        data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: true,
            includesHotel: faker.datatype.boolean(),
        },
    });
}

export async function createTicketTypeNoHotel() {
    return prisma.ticketType.create({
        data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: faker.datatype.boolean(),
            includesHotel: false,
        },
    });
}

export async function createTicketTypeCorrect() {
    return prisma.ticketType.create({
        data: {
            name: faker.name.findName(),
            price: faker.datatype.number(),
            isRemote: false,
            includesHotel: true,
        },
    });
}

export async function createHotels() {
    return prisma.hotel.createMany({
        data: [
            {
                name: faker.name.findName(),
                image: faker.image.business()
            },
            {
                name: faker.name.findName(),
                image: faker.image.business(),
            }
        ]
    });
}
