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
    audioUrl: "audiostring",
    _id: id,
  });
  await Session.create({
    title: "afternoon",
    comment: "hello",
    audioUrl: "audiostring",
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
