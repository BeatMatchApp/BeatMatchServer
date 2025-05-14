import { Response } from "express";

export const getEvents = (_, res: Response) => {
  res.json({
    events: [
      "Party",
      "Drive",
      "Work out",
      "Dance",
      "Cooking",
      "Study",
      "Meeting",
      "Travel",
      "Sleep",
      "Picnic",
    ],
  });
};

export const getMoods = (_, res: Response) => {
  res.json({
    moods: [
      "Happy",
      "Sad",
      "Calm",
      "Romantic",
      "Nostalgic",
      "Hype",
      "Motivated",
      "Angry",
      "Energetic",
      "Focused",
    ],
  });
};
