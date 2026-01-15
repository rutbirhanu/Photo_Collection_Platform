const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/auth", require("./routes/userRoute"));
app.use("/payment", require("./routes/paymentRoute"));
app.use("/event", require("./routes/eventRoute"));
app.use("/album", require("./routes/albumRoute"));
app.use("/upload", require("./routes/uploadRoute"));

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

module.exports = app;
