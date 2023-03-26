import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerJsDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import routes from './routes';

// Options for swagger
const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: "Homeset API Swagger Doc",
        version: "0.1.0",
        description: "This is the CRUD Homeset API",
    },
    host: `localhost:3000`, // Host (optional)
    basePath: '/', // Base path (optional)
  };
  
  // Options for the swagger docs
  const options: Options = {
    // Import swaggerDefinitions
    definition: swaggerDefinition,
    // Path to the API docs
    // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
    apis: ["./src/entity/*.ts", "./src/routes/*.ts"],
  };

  // FIXME Fixed the JSDoc
// const swaggerSpec = swaggerJsDoc(options);

// Create a new express application instance
export const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {explorer: true}));

// Set all routes from routes folder
// @ts-ignore
app.use('/', routes);
