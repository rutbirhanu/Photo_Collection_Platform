const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/payments", require("./routes/paymentRoute"));
// app.use("/api/events", require("./routes/eventRoute"));
app.use("/api/albums", require("./routes/albumRoute"));
// app.use("/api/upload", require("./routes/upload.routes"));

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

module.exports = app;
