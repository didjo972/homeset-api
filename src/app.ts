import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc, {Options, SwaggerDefinition} from 'swagger-jsdoc';
import routes from './routes';

// Options for swagger
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Homeset API Swagger Doc',
    version: '0.1.0',
    description: 'This is the CRUD Homeset API',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'didjo972',
      url: 'https://github.com/didjo972',
      email: 'didjo972@gmail.com',
    },
  },
  // servers: [
  //     {
  //         url: "http://localhost:3000/"
  //     }
  // ],
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
  },
  // host: `localhost:3000`, // Host (optional)
  // basePath: '/', // Base path (optional)
};

// Options for the swagger docs
const options: Options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./src/entity/**/*.{js,ts}', './src/routes/*.{js,ts}'],
};

const swaggerSpec = swaggerJsDoc(options);

// Create a new express application instance
export const app = express();

/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  res.status(500).send('Service unavailable !');
}

/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
function logger(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log('test');
  console.debug(req);
  console.debug(req.path);
  console.debug(req.body);
  console.debug(req.params);
  // next();
}

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {explorer: true}),
);

app.use(logger);

// Set all routes from routes folder
app.use('/', routes);

// Set error handler to not display the stack trace
app.use(errorHandler);
