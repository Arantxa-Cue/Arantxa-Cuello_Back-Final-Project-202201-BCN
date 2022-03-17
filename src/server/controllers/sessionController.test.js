const Session = require("../../database/models/Session");
const {
  getAllSessions,
  deleteSession,
  createSession,
} = require("./sessionController");

jest.mock("../../database/models/Session");

describe("Given an getAllSessions controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a response", () => {
    test("Then it should call method json with a list of sessions of the received response", async () => {
      const res = {
        json: jest.fn(),
      };

      const sessions = [
        {
          id: 2345,
          title: "morning session",
          comment: "lovely",
          audioUrl: "thisisanurl.wev",
        },
      ];

      Session.find = jest.fn().mockResolvedValue(sessions);
      await getAllSessions(null, res);

      expect(res.json).toHaveBeenCalledWith({ sessions });
    });
  });
});

describe("Given a deleteSession controller", () => {
  describe("When it receives a response with the session to be deleted", () => {
    test("Then it should call method json with the expectedSessionToDelete", async () => {
      const expectedSessionToDelete = {
        id: "2345",
        title: "morning session",
        comment: "lovely",
        audioUrl: "thisisanurl.wev",
      };
      const req = {
        params: { id: "2345" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      Session.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(expectedSessionToDelete);

      await deleteSession(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response with an id not existing", () => {
    test("Then it should call next with error messege 'Session not found'", async () => {
      const req = { params: { id: 20 } };
      const next = jest.fn();
      const error = new Error("Session not found");

      Session.findByIdAndDelete = jest.fn().mockRejectedValue(error);
      await deleteSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
describe("Given a createSession controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a wrong request", () => {
    test("Then it should call next", async () => {
      const next = jest.fn();

      await createSession(null, null, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
