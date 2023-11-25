import express, {
  type ErrorRequestHandler,
  type Request,
  type Response
} from 'express';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use((_: Request, res: Response, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Access-Control-Allow-Credentials, Cross-Origin'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to log HTTP requests
app.use(morgan('tiny'));
// Routes
app.use('/', routes);
// Error handling
const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';

  console.error(err);

  res.status(status).json({
    error: {
      message,
      status
    }
  });
};
app.use(errorHandler);

export default app;
