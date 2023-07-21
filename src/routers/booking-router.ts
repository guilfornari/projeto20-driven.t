import { Router } from 'express';
import { authenticateToken } from '../middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
    .get('/',);

export { bookingRouter };