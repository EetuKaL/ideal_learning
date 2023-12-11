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
import https from 'https'
import { Client } from 'pg';


var privateKey  = fs.readFileSync('./privateKey.key', 'utf8');
var certificate = fs.readFileSync('./certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
// Enable All CORS Requests
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors({origin: ''}));
const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'postgres',
  user: 'postgres',
  password: 'kissa123'
})

const fn = async () => {
  await client.connect()
  const result = await client.query('SELECT * FROM public.users')
  console.log(result);
  await client.end()
}
fn()

app.get("/", async (req, res) => {
  let response;
  try {
    let data = await getData();
    response = { statusCode: 200, body: await JSON.parse(data) };
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

app.put("/", async (req, res) => {
  if (
    req.headers.hasOwnProperty("name") &&
    req.headers.hasOwnProperty("password")
  ) {
    try {
      const data = JSON.parse(await getData());

      const password = req["headers"]["password"];
      const name = req["headers"]["name"];

      if (await checkAuthentication(name, password)) {
        let exam: Exam = req["body"];

        exam["published_at"] = new Date().toString();

        const dataToSave = {
          ...data,
          exams: data["exams"].concat(exam),
        };

        saveData(JSON.stringify(dataToSave), res);
      } else {
        res.status(400).send("wrong username or password");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).send("name or password is missing in headers");
  }
});
app.put("/delete", async (req, res) => {
  if (
    req.headers.hasOwnProperty("name") &&
    req.headers.hasOwnProperty("password")
  ) {
    if (req.body.hasOwnProperty("id")) {
      try {
        const id = req["body"]["id"];
        const data = JSON.parse(await getData());

        const newData = {
          ...data,
          exams: data.exams.filter((exam: Exam) => exam.examId !== id),
        };

        saveData(JSON.stringify(newData), res);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    res.status(400).send("name or password is missing");
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
