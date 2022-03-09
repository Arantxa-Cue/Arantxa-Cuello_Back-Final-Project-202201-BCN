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
