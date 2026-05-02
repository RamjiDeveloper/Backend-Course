import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN_CORS,
    credentials: true
}))

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/testing', (req, res) => {
  res.send('MY TESTING IS SUCCESSFULLY!')
})



export { app };