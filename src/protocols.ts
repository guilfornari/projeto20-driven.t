import { Booking, Payment, Ticket } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type ViaCEPAddressError = {
  error: boolean;
};

export type ViaCEPAddressResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type CardPaymentParams = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export type InputTicketBody = {
  ticketTypeId: number;
};

export type HotelWithRooms = {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  Rooms: [
    {
      id: number;
      name: string;
      capacity: number;
      hotelId: number;
      createdAt: Date;
      updatedAt: Date;
    },
  ];
};

export type BookingWithRooms = {
  id: number;
  Room:
  {
    id: number;
    name: string;
    capacity: number;
    hotelId: number;
    createdAt: Date;
    updatedAt: Date;
  }
};

export type BookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
