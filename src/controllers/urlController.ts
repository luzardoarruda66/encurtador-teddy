import express from "express";
import URL from "../models/url";
import { generateShortUrl } from "../utils/generateShortUrl";

export const shortenUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { originalUrl } = req.body;
    let shortUrl = "";
    let urlExists = true;
    while (urlExists) {
      shortUrl = generateShortUrl();
      urlExists = (await URL.findOne({ where: { shortUrl } })) !== null;
    }
    const userId = req.userId;
    await URL.create({ originalUrl: originalUrl, shortUrl, userId });
    res
      .status(201)
      .json({ shortUrl: `http://localhost:3000/${shortUrl}`, originalUrl });
  } catch (error) {
    res.status(500).json({ error: "Failure to short URL" });
  }
};

export const redirectUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const url = await URL.findOne({ where: { shortUrl } });

    if (!url) {
      res.status(404).json({ error: "Cannot find that URL!" });
      return;
    }
    url.clicks += 1;
    await url.save();

    const urlWithProtocol = url.originalUrl.includes("http://")
      ? url.originalUrl
      : "http://".concat(url.originalUrl);

    res.status(301).redirect(urlWithProtocol);
  } catch (error) {
    res.status(500).json({ error: "Failure to redirect!" });
  }
};

export const listUserUrls = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "User not logged!" });
      return;
    }
    const urls = await URL.findAll({ where: { userId } });
    console.log(urls)
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUrl = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const { newOriginalUrl } = req.body;
    const userId = req.userId;

    const url = await URL.findOne({ where: { shortUrl, userId } });
    if (!url) {
      res.status(404).json({ error: "URL not found or not belongs to user!" });
      return;
    }
    url.originalUrl = newOriginalUrl;
    await url.save();

    res.json({ message: "URL updated successfuly!", url });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { shortUrl } = req.params;
    const userId = req.userId;

    const url = await URL.findOne({ where: { shortUrl, userId } });
    if (!url) {
      res.status(404).json({ error: "URL not found or not belongs to user!" });
      return;
    }

    await url.destroy();
    res.status(202).json();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
