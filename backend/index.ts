import express, { Express, Request, Response, response } from "express";
import { DBNotify, Exam } from "./types/types";
const fs = require("fs");
import cors from "cors";
import isLogin from "./middleware/middleware";
import https from "https";
import { fetchFullExams } from "./queries/exam/selectExam";
import { deleteExam } from "./queries/exam/deleteExam";
import { postExam } from "./queries/exam/insertUpdateExam";
import { registerUser } from "./queries/user/insertUser";
import hashPassword from "./utils/hashPassword";
import { getUser } from "./queries/user/selectUser";
import bcrypt from "bcrypt";
import { genrateToken } from "./middleware/genrateToken";
import { errorDuplicateKey } from "./utils/Errors";
import {Server as SocketServer } from "socket.io"
import http from 'http'

/// Https credentials
var privateKey = fs.readFileSync("./privateKey.key", "utf8");
var certificate = fs.readFileSync("./certificate.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };

/// Start App
const app = express();

app.use(express.json()).use(cors());

var httpsServer = https.createServer(credentials, app);

const io = new SocketServer(httpsServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: '*'
  }
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('messageFromClient', (data) => {
    console.log("data: ", data);
  });
  
});


function emitMessage(notify: DBNotify) {
  let msg: string;
  console.log('trying to emit message')
  console.log(notify)
  if(notify.type === 'insert') {
    msg = 'New Exam is available'
  } else if ( notify.type === 'update') {
    msg = `${notify.name} has been updated`
  } else if (notify.type === 'delete') {
    msg = `${notify.name} has been deleted`
  } else {
    msg = 'message from server'
  }
  io.emit('messageFromServer', {data: msg})
}


app.get("/", isLogin, async (req, res) => {
  let statusMessage
  let statusCode
  let user
  try {
     user = await fetchFullExams();
    
/*     statusMessage = "User or password doesn't match"; */
    statusCode = 200
      
    
  } catch (error) {
    statusMessage = "Internal Server Error"
    statusCode = 500
  } finally {
  res.statusMessage = statusMessage || ""
  res.statusCode = statusCode || 500
   res.json({body: user})
  }
});

app.get("/:id", isLogin, async (req, res) => {
  let response;
  const examId = parseInt(req.params.id);
  try {
    let user = await fetchFullExams(examId);
    response = { statusCode: 200, body: user };
  } catch (error) {
    response = { statusCode: 500, message: "Internal server error:" };
  } finally {
    res.json(response);
  }
});

app.post("/", isLogin, async (req, res) => {
  try {
    let exam: Exam = req["body"];
    await postExam(exam, emitMessage);
    res
      .status(200)
      .send({ statusCode: 200, message: "succesfully posted exam" });
  } catch (error) {
    res.status(500).send({ statusCode: 500, message: "failed to post exam" });
    console.log(error);
  }
});

app.delete("/:id", isLogin, async (req, res) => {
  const examID = req.params.id;
  try {
    if (examID) {
      deleteExam(parseInt(examID), emitMessage);
      res.status(200).json({ message: "Exam deleted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the exam" });
  }
});

app.post("/register", async (req, res) => {
  if (req.body["user_email"] && req.body["user_password"]) {
    try {
      const { user_email, user_password, user_firstName, user_lastName } =
        req.body;
      const hashedPassword = await hashPassword(user_password.toString());

      await registerUser(
        user_email.toString(),
        hashedPassword,
        user_firstName,
        user_lastName
      );
      res.statusMessage = `Successfully registered email: ${user_email}`;
      res
        .status(200)
        .send(`Successfully created user: ${req.body["user_email"]}`);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message === errorDuplicateKey) {
          res.statusMessage = "Email is already registered";
          res.status(409).send("Email is already registered");
        } else {
          res.statusMessage = "Internal server error";
          res.status(500).send("Internal server error");
        }
      }
    }
  } else {
    console.log("herre");
    res.statusMessage = "Email or password missing.";
    res.status(400).send("user_id or user_password in the request was missing");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await getUser(user_email);
    if (user && (await bcrypt.compare(user_password, user.user_password))) {
      const token = genrateToken(user_email);
      res.status(200).json({ token });
    } else {
      res.statusMessage = "User or password doesn't match";
      res.status(404).send("User or password doesn't match");
    }
  } catch (error) {
    console.log(error);
    res.statusMessage = "Internal server error";
    res.status(500).send("Internal server error");
  }
});


httpsServer.listen(3001, () => {
  console.log(`Example app listening on port 3001`);
});
