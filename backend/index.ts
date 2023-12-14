import express, { Express, Request, Response, response } from "express";
import { Exam } from "./types/types";
import { v4 as uid } from "uuid";
/* const quizState = require("../quizState.json"); */
const fs = require("fs");
const { writeFile } = require("fs");
import bcrypt from "bcrypt";
import { promisify } from "util";
import cors from "cors";
import { genrateToken } from "./genrateToken";
import isLogin from "./middleware";
import https from "https";
import {
  fetchAndBuildExams,
  fetchAnswerOptions,
  fetchExams,
  fetchQuestions,
} from "./queries/selectExam";
import { postNewExam } from "./queries/insertExam";
import { deleteExam } from "./queries/deleteExam";

var privateKey = fs.readFileSync("./privateKey.key", "utf8");
var certificate = fs.readFileSync("./certificate.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };
// Enable All CORS Requests
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

/* fetchQuestions(1); */
/* fetchAnswerOptions(4); */

app.get("/", async (req, res) => {
  let response;
  try {
    let data = await fetchAndBuildExams();
    response = { statusCode: 200, body: data };
  } catch (error) {
    response = { statusCode: 500, message: "Internal server error:" };
  } finally {
    res.json(response);
  }
});

app.post("/initialData", async (req, res) => {
  if (req["body"].hasOwnProperty("exams")) {
    try {
      saveData(JSON.stringify(req["body"]), res);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send({
      statusCode: 500,
      message:
        " in the request body was 'exams' property missing \n check if there is typos",
    });
  }
});

app.post("/", async (req, res) => {
  try {
    let exam: Exam = req["body"];
    await postNewExam(exam);
    res
      .status(200)
      .send({ statusCode: 200, message: "succesfully posted exam" });
  } catch (error) {
    res.status(500).send({ statusCode: 500, message: "failed to post exam" });
    console.log(error);
  }
});

app.delete("/:id", async (req, res) => {
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

app.post("/createAccount", async (req, res) => {
  if (
    req.headers.hasOwnProperty("name") &&
    req.headers.hasOwnProperty("password")
  ) {
    try {
      const authName = req.headers["name"];
      const authPassword = req.headers["password"]?.toString();
      const data = JSON.parse(await getData());
      const hashedPassword = await hashPassword(authPassword);
      let newData = {
        ...data,
        account: {
          id: uid(),
          name: authName,
          password: hashedPassword,
        },
      };

      saveData(JSON.stringify(newData), res);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(400).send("Name or password header is missing");
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  console.log(req);
  const data = JSON.parse(await getData());

  if (typeof password !== "string") {
    throw new Error("Password not a string");
  }

  if (
    data["account"]["name"] === name &&
    (await bcrypt.compare(password, data["account"]["password"]))
  ) {
    // If authentication is successful, generate a JWT token
    const token = genrateToken(data["account"]["id"]);
    // Send the token in the response
    res.status(200).json({ token });
  } else {
    res.status(400).send("wrong username or password");
  }
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getData = async () => {
  const readFileAsync = promisify(fs.readFile);
  const data: string = await readFileAsync("./quizState.json", "utf8");
  return data;
};

const saveData = (data: string, res: Response) => {
  writeFile("./quizState.json", data, (error: Error) => {
    if (error) {
      return res.status(500).send("Error when posting data in the server");
    }
    res.status(200).send({ statusCode: 200, message: "Post was succesfull" });
  });
};
const hashPassword = async (plaintextPassword: any) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    return hash;
  } catch (error) {
    // Handle error
    throw new Error("Password hashing failed");
  }
};

const checkAuthentication = async (
  username: any,
  password: any
): Promise<boolean> => {
  const data = JSON.parse(await getData());

  if (typeof password !== "string") {
    throw new Error("Password not a string");
  }

  if (
    data["account"]["name"] === name &&
    (await bcrypt.compare(password, data["account"]["password"]))
  ) {
    return true;
  } else {
    return false;
  }
};
