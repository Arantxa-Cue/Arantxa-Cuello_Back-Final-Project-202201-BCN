const Session = require("../../database/models/Session");
const {
  getAllSessions,
  deleteSession,
  createSession,
  detailSession,
  updateSession,
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
  describe("When it receives a response with id of a session and database not connected", () => {
    test("Then it should call next error .", async () => {
      const req = {
        params: {
          id: "35",
        },
      };
      const next = jest.fn();
      const error = new Error("Session not deleted");

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
describe("Given a detailSession controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a response with an id", () => {
    test("Then it should method json with the session", async () => {
      const expectedSessionToFind = {
        id: "2345",
      };
      const req = {
        params: { id: "2345" },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      Session.findById = jest.fn().mockResolvedValue(expectedSessionToFind);

      await detailSession(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
  describe("When it receives a response with a wrong id", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        params: { id: "2345" },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      Session.findById = jest.fn().mockResolvedValue(null);

      await detailSession(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
describe("Given a updateSession controller", () => {
  describe("When it receives a response with session id 23 ", () => {
    test("Then it should call method json with the updated session", async () => {
      const sessionToUpdate = {
        id: "23",
        text: "Hello!",
      };
      const req = {
        params: { id: sessionToUpdate.id },
        body: sessionToUpdate,
      };
      const expectedUpdatedMessage = sessionToUpdate;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Session.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(expectedUpdatedMessage);

      await updateSession(req, res, null);

      expect(res.json).toHaveBeenCalledWith(sessionToUpdate);
    });
  });

  describe("When it receives a response with id of not existing session", () => {
    test("Then it should call next with error message 'Session not found'", async () => {
      const req = {
        params: {
          id: "33",
        },
      };
      const next = jest.fn();
      const error = new Error("Session not found");

      Session.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);
      await updateSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a response with id of a session and database not connected", () => {
    test("Then it should call next error message 'Couldn't update session'", async () => {
      const req = {
        params: {
          id: "35",
        },
      };
      const next = jest.fn();
      const error = new Error("Couldn't update session");

      Session.findByIdAndUpdate = jest.fn().mockRejectedValue(error);
      await updateSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
