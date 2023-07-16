import { ApplicationError } from '@/protocols';

export function notValidTicketError(): ApplicationError {
  return {
    name: 'NotValidTicketError',
    message: 'Your ticket is not valid for this search!',
  };
}
