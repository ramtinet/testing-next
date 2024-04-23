import express from 'express';

const app = express();
const port = 4000;

const asyncHandler = (fn) =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

app.get('/testNext', (req, res, next) => {
  const throwErr = true;
  if (throwErr) {
    // error handler will catch this error, this is because the handler is synchronous
    throw new Error();
  }
  next();
});

app.get(
  '/testNextAsync',
  asyncHandler(async (req, res, next) => {
    const throwErr = true;
    if (throwErr) {
      // error handler will catch this error, this is because the handler is wrapped in a asyncHandler
      throw new Error();
    }
    next();
  })
);

app.get('/test', (req, res, next) => {
  const throwErr = true;
  if (throwErr) {
    // error handler will catch this error, this is because the handler is synchronous
    throw new Error();
  }
});

app.get(
  '/testAsync',
  asyncHandler(async (req, res, next) => {
    const throwErr = true;
    if (throwErr) {
      // error handler will catch this error, this is because the handler is wrapped in a asyncHandler
      throw new Error();
    }
  })
);

app.get('/test2', (req, res, next) => {
  res.json({ status: 200 });
  next();
});

app.get('/test2', (req, res, next) => {
  next(); // this will not throw an error, because the response has already been sent
});

app.get('/test3', (req, res, next) => {
  next(); //throws 404 (not found), because we are using next(), and express is unable to match the next route, so the standard 404 handler will be used
});

app.use((err, req, res, next) => {
  // Error middleware, will catch all errors thrown inside the routes/handlers
  res.status(500);
  res.json({ status: 500 });
});

app.listen(port, () => {
  console.log('Running on port ', port);
});
