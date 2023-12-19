import express, { Express, Request, Response, response } from "express";
import { Exam } from "./types/types";
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
import { errorDuplicateKey, errorUserNotFound } from "./Errors";
import bcrypt from "bcrypt";
import { genrateToken } from "./middleware/genrateToken";
var privateKey = fs.readFileSync("./privateKey.key", "utf8");
var certificate = fs.readFileSync("./certificate.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };

// Enable All CORS Requests
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get("/", isLogin, async (req, res) => {
  let response;
  try {
    let user = await fetchFullExams();
    response = { statusCode: 200, body: user };
  } catch (error) {
    response = { statusCode: 500, message: "Internal server error:" };
  } finally {
    res.json(response);
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
    await postExam(exam);
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
      deleteExam(parseInt(examID));
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
      const hashedPassword = await hashPassword(
        req.body["user_password"].toString()
      );

      await registerUser(req.body["user_email"].toString(), hashedPassword);
      res
        .status(200)
        .send(`Successfully created user: ${req.body["user_email"]}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === errorDuplicateKey) {
          res.status(409).send("User is already registered");
        } else {
          res.status(500).send("Internal server error");
        }
      }
    }
  } else {
    res.status(400).send("user_id or user_password in the header is missing");
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
      res.status(404).send("User or password doesn't match");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
