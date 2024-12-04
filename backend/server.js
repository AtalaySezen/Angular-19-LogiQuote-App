const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");
const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);

app.get("/", (req, res) => {
  res.send(`
      <html>
        <head>
          <title>LogiQuote</title>
          <style>
            body {
              background-color: #fff;
              text-align: center;
              padding: 50px;
            }
            h1 {
              color: black;
            }
          </style>
        </head>
        <body>
          <h1>LogiQuote</h1>
        </body>
      </html>
    `);
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
