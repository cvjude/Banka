/* eslint-disable no-console */
/* eslint-disable linebreak-style */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerdoc from './swagger.json';
import router from './router/router';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v2/', router);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

app.all('*', (req, res) => res.status(404).json({
  status: 404,
  error: 'Page not found',
}));

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`app is listening on ${port}!`);
});

export default app;
