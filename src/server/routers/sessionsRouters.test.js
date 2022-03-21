const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("..");

const connectToDB = require("../../database/index");

const Session = require("../../database/models/Session");
const User = require("../../database/models/User");

let mongoServer;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();
  await connectToDB(connectionString);
});

beforeEach(async () => {
  const arantxa = await User.create({
    name: "arantxa",
    username: "arantxa",
    password: "$2b$10$xGTIAjtkYytiIwOeygNDUelnkFBp3pLHY3YPLDkPY2.nEOTxHKv/W",
  });
  await Session.create({
    title: "morning",
    comment: "hello",
    iFrame: "audiostring",
    user: arantxa.id,
  });
  await Session.create({
    title: "afternoon",
    comment: "hello",
    iFrame: "audiostring",
    user: arantxa.id,
  });

  const { body } = await request(app).post("/users/login").send({
    username: "arantxa",
    password: "123",
  });
  userToken = body.token;
});

afterEach(async () => {
  await Session.deleteMany({});
  await User.deleteMany({});
});

afterAll(() => {
  mongoose.connection.close();
  mongoServer.stop();
});

describe("Given an /allsessions/ endpoint", () => {
  describe("When it receives a GET request", () => {
    test("Then it should response with a 200 status code", async () => {
      await request(app).get("/allsessions/").expect(200);
    });
    test("Then it should response with an array of two sessions", async () => {
      const { body } = await request(app).get("/allsessions/").expect(200);
      expect(body.sessions).toHaveLength(2);
    });
  });
});

describe("Given an /create/ endpoint", () => {
  describe("When it receives a POST request with invalid date", () => {
    test("Then it should respond with a code 500 and the error message", async () => {
      const newSession = { title: "hello", date: "today" };
      const expectedError = "Internal server error!";

      const { body } = await request(app)
        .post("/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newSession)
        .expect(500);

      expect(body.error).toBe(true);
      expect(body.message).toBe(expectedError);
    });
  });
});
