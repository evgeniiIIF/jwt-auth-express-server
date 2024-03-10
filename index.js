import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { appRouter } from './routes/app.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
// import { userRouter } from './routes/user.routes.js';
// import { postRouter } from './routes/post.routes.js';
config();

const PORT = process.env.PORT || 19000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(express.json());
app.use('/api', appRouter);
app.use(errorMiddleware);
// app.use('/api', userRouter);
// app.use('/api', postRouter);

// app.get('/', (req, res) => {
//   res.send('jjNeoplan');
// });

// парсит запросы по типу: application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
