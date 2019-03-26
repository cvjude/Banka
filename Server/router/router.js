/* eslint-disable linebreak-style */
import express from 'express';
import controller from '../controllers/controller';

// the sub app using url versioning
const router = express();

router.get('/', controller.welcome);

export default router;
