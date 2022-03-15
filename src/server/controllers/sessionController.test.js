const Session = require("../../database/models/Session");
const { getAllSessions } = require("./sessionController");

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

/* describe("Given a deleteSession controller", () => {
  describe("When it receives a response with the if of an existing session", () => {
    test("Then it should call method json with the removed session", async () => {
      const idRemovedSession = {
        id: "22",
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req = {
        params: { id: "22" },
      };
      const status = 200;

      Session.findByIdAndDelete = jest.fn().mockResolvedValue(idRemovedSession);

      await deleteSession(req, res, null);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(idRemovedSession);
    });
  });
}); */
