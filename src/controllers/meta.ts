import { Response } from "express";
import { EVENT_CATEGORIES } from "../consts/events";
import { MOOD_CATEGORIES } from "../consts/moods";

export const getEvents = (_, res: Response) => {
  res.json({
    events: EVENT_CATEGORIES,
  });
};

export const getMoods = (_, res: Response) => {
  res.json({
    moods: MOOD_CATEGORIES,
  });
};
