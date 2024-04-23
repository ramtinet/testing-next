import express from 'express';

const app = express();
const port = 4000;

const asyncHandler = (fn) =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

const shadyFunction = () => {
  throw Error('hello world');
};

app.get('/test', (req, res, next) => {
  // error handler below will catch this error, this is because the handler is synchronous
  shadyFunction();
  next();
});

app.get(
  '/testAsync',
  asyncHandler(async (req, res, next) => {
    // error handler below will catch this error, this is because the handler is wrapped in a asyncHandler
    shadyFunction();
    next();
  })
);

app.get('/test2', (req, res, next) => {
  next(); //throws 404 (not found), because we are using next(), and express is unable to match the next route, so the standard 404 handler would be used
});

app.use((err, req, res, next) => {
  res.json({ status: 500 });
});

app.listen(port, () => {
  console.log('Running on port ', port);
});
