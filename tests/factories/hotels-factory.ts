import faker from '@faker-js/faker';
import { prisma } from '@/config';

export function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export function createTicketTypeNoHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: false,
    },
  });
}

export function createTicketTypeCorrect() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function createHotels() {
  return prisma.hotel.createMany({
    data: [
      {
        name: faker.name.findName(),
        image: faker.image.business(),
      },
      {
        name: faker.name.findName(),
        image: faker.image.business(),
      },
    ],
  });
}

export function getHotelsToTest() {
  return prisma.hotel.findMany();
}

export function createRooms(hotelId: number) {
  return prisma.room.createMany({
    data: [
      {
        name: faker.datatype.string(3),
        capacity: faker.datatype.number({ min: 1, max: 5, precision: 1 }),
        hotelId,
      },
      {
        name: faker.datatype.string(3),
        capacity: faker.datatype.number({ min: 1, max: 5, precision: 1 }),
        hotelId,
      },
    ],
  });
}
