const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", require("./routes/userRoute"));
app.use("/api/payments", require("./routes/paymentRoute"));
app.use("/api", require("./routes/eventRoute"));
app.use("/api/albums", require("./routes/albumRoute"));
// app.use("/api/upload", require("./routes/upload.routes"));

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

module.exports = app;
