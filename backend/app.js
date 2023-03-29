import express from 'express';
import mongoose from 'mongoose';
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user",router); // http://localhost:5000/api/user/login
app.use("/api/blog",blogRouter);
const url = "mongodb+srv://admin:qPVClCyaXbCq76JQ@cluster0.nyrvbtc.mongodb.net/Blog?retryWrites=true&w=majority";

mongoose.connect(url)
.then(()=>app.listen(5000))
.then(()=>console.log("connect to database at port 5000"))
.catch((err)=>console.log(err));


app.use("/api" , (req, res, next) => {
    res.send("Hellow World..");
})

