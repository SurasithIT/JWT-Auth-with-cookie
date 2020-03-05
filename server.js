const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = 3000;
const cookieParser = require("cookie-parser");
const users = require("./users.json");
const cors = require("cors");
require("dotenv/config");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true
  })
);

app.post("/auth/login", (req, res) => {
  const name = req.body.name;

  if (name !== "Mook") {
    throw new Error("account information not valid");
  }
  //   const accessToken = generateAccessToken(name);
  const payload = {
    name: name,
    role: "customer"
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "100s"
  });
  console.log(accessToken);
  res.cookie("Bearer", accessToken, {
    maxAge: 3600,
    httpOnly: true
    // secure: true
  });
  res.json({ email, password });
});

app.get("/api/users", authenticateToken, (req, res) => {
  console.log(users);
  console.log(req.cookies);
  //   console.log(user.name);
  console.log(req.user.name);
  res.json(users.filter(user => user.name === req.user.name));
});

app.delete("/logout", (req, res) => {
  res.cookie("Bearer", "");
  res.send("logout sucessfull!");
  console.log(req.cookies);
});

function authenticateToken(req, res, next) {
  const token = req.cookies.Bearer;
  console.log(token);
  if (token == undefined) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
}

app.use((err, req, res, next) => {
  res.json(err);
});

app.listen(PORT, () => {
  console.log("Auth service listening on", PORT);
});
