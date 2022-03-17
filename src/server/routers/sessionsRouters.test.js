const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const ObjectId = require("bson-objectid");
const app = require("..");

const connectToDB = require("../../database/index");

const Session = require("../../database/models/Session");

const id = ObjectId();

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();
  await connectToDB(connectionString);
});

beforeEach(async () => {
  await Session.create({
    title: "morning",
    comment: "hello",
    iFrame: "audiostring",
    _id: id,
  });
  await Session.create({
    title: "afternoon",
    comment: "hello",
    iFrame: "audiostring",
  });
});

afterEach(async () => {
  await Session.deleteMany({});
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
describe("Given a /delete/:id endpoint", () => {
  describe("When it receives a DELETE request", () => {
    test("Then it should response a 200 code", async () => {
      await request(app).delete(`/delete/${id}`).expect(200);
    });
  });
});

describe("Given a /create/ endpoint", () => {
  describe("When it receives a POST request with a new session data", () => {
    test("Then it should respond with 201 code and the new session", async () => {
      const newSession = {
        title: "afternoon",
        comment: "hello",
        iFrame: "example",
        date: "2022-03-15T19:32:31.025Z",
        // id: "6230eaa1e5154a6516479422",
      };
      const { body } = await request(app)
        .post("/create")
        .send(newSession)
        .expect(201);

      expect(body.title).toBe(newSession.title);
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
        .send(newSession)
        .expect(500);

      expect(body.error).toBe(true);
      expect(body.message).toBe(expectedError);
    });
  });
});
