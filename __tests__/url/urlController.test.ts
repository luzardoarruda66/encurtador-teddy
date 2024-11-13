import express from "express";
import URL from "../../src/models/url";
import {
  listUserUrls,
  redirectUrl,
  shortenUrl,
} from "../../src/controllers/urlController";

jest.mock("../../src/models/url");

describe("URL Controller", () => {
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
      redirect: jest.fn(),
    };
  });

  describe("shortenUrl", () => {
    it("Must return error to create short url", async () => {
      req.body = {
        originalUrl: "invalidUrl",
      };
      (URL.findOne as jest.Mock).mockResolvedValue(null);
      (URL.create as jest.Mock).mockRejectedValue(new Error("Invalid Url"));

      await shortenUrl(req as express.Request, res as express.Response);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("Return status code 200 when create a short url was a success", async () => {
      req.body = {
        originalUrl: "http://www.google.com",
      };
      (URL.create as jest.Mock).mockResolvedValue({
        id: 1,
        originalUrl: req.body.originalUrl,
        shortUrl: "http://localhost:3000/mock12",
      });
      (URL.findOne as jest.Mock).mockResolvedValue(null);

      await shortenUrl(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ shortUrl: expect.any(String) })
      );
    });
  });

  describe("redirectUrl", () => {
    it("Must return 404 when short url don't exist", async () => {
      req.params = { shortUrl: "mckUrl" };
      (URL.findOne as jest.Mock).mockResolvedValue(null);

      await redirectUrl(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Cannot find that URL!" });
    });

    it("Must redirect user when short url exist", async () => {
      req.params = { shortUrl: "mckUrl" };
      (URL.findOne as jest.Mock).mockResolvedValue({
        originalUrl: "http://www.google.com/long-example",
        clicks: 0,
        save: jest.fn(),
      });

      await redirectUrl(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.redirect).toHaveBeenCalledWith(
        "http://www.google.com/long-example"
      );
    });
  });

  describe("listUserUrls", () => {
    it("Must return a list of URLs when user authenticated", async () => {
      req.userId = 1;
      (URL.findAll as jest.Mock).mockResolvedValue([
        {
          id: 1,
          originalUrl: "http://example.com/1",
          shortUrl: "abc123",
          clicks: 2,
        },
        {
          id: 2,
          originalUrl: "http://example.com/2",
          shortUrl: "123abc",
          clicks: 15,
        },
      ]);

      await listUserUrls(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ originalUrl: "http://example.com/1" }),
          expect.objectContaining({ originalUrl: "http://example.com/2" }),
        ])
      );
    });

    it("Must return error to list URLs when user not logged", async () => {
      (URL.findAll as jest.Mock).mockRejectedValue(
        new Error("Erro ao listar URLs")
      );

      await listUserUrls(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "User not logged!" });
    });

    it("Must return a internal error when user is logged but the request is invalid", async () => {
      req.userId = 1;
      (URL.findAll as jest.Mock).mockRejectedValue(
        new Error("Erro ao listar URLs")
      );

      await listUserUrls(req as express.Request, res as express.Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
