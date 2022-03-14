const Session = require("../../database/models/Session");
const { getAllSessions, deleteSession } = require("./sessionController");

jest.mock("../../database/models/Session");

describe("Given an getAllSessions controller", () => {
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
  describe("When it receives a response", () => {
    test("Then it should return an object with the id of the removed session", async () => {
      const idRemovedSession = {
        id: 22,
      };

      const res = {
        json: jest.fn(),
      };

      const req = {
        params: { id: 22 },
      };

      Session.findByIdAndDelete = jest.fn().mockResolvedValue(idRemovedSession);

      await deleteSession(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
