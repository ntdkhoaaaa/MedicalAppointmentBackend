import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
// const db = require("../app/models")
// import cors from 'cors';

const cookieParser = require("cookie-parser");
require("dotenv").config();
let app = express();
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.URL_REACT);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
let port = process.env.PORT || 6969;
// app.use('/',(req, res) => {
//   res.send('helloos')
// })
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();
app.listen(port, () => {
  console.log("Backend Nodejs  " + port);
});
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))

// app.use(bodyParser.json({ limit: "50mb" }));


// const job = schedule.scheduleJob("59 * * * *", async function async() {
//   let a = await deleteFreshToken.deleteFreshToken();
// });

// const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);
// const app=express(); co r
// app.use(bodyParser.json());
// app.use(cors());
app.post("/chat", async (req, res) => {
  try {
    // Your code here
    const { prompt } = req.body;
    console.log("co vo day hong", req.body);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 1024,
      
      temperature: 0.7,
      prompt: prompt,
    });
    res.send(completion.data.choices[0].text);
  } catch (error) {
    console.log(error.message);
  }
});


