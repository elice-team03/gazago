const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const viewsRotuer = require("./src/client/routers/views");
const indexRouter = require("./src/server/routers/index");
const usersRouter = require("./src/server/routers/users");
const productsRouter = require("./src/server/routers/products");
const categoriesRouter = require("./src/server/routers/categories");

const app = express();

// MongoDB connect
require("dotenv").config();
const port = process.env.PORT || 5001;
const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri);
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Listening at PORT:${port}`);
});

// view engine setup
app.set("views", path.join(__dirname, "src", "client", "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRotuer);

app.use("/api", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  err.stateCode = err.stateCode || 500;
  err.message = err.message || "Server Error";
  res.json({ code: err.stateCode, message: err.message });
});

module.exports = app;
