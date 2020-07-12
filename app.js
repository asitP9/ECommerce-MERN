const express=require("express");
const morgan=require("morgan");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const expressValidator = require("express-validator");


// import routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const categoryRoutes=require("./routes/category");
const productRoutes=require("./routes/product");

dotenv.config();

// db
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
. then(()=>console.log("DB Connected!!!"));

mongoose.connection.on("error",(err)=>console.log(`DB Connection Error: ${err.message}`));

const app = express();



// routes middleware

// middlewares
app.use(morgan("dev"));
// we get the json data from the request body
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const PORT=process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`The app is listening to ${PORT}`)
});