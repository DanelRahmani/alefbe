// Word topics for the dictionary, extending the old app's twelve categories.

export type Topic =
  | "people"
  | "body"
  | "food"
  | "home"
  | "things"
  | "places"
  | "nature"
  | "weather"
  | "animals"
  | "time"
  | "feelings"
  | "describing"
  | "colours"
  | "verbs"
  | "numbers"
  | "learning"
  | "everyday";

export const TOPIC_LABELS: Record<Topic, string> = {
  people: "People",
  body: "Body",
  food: "Food and drink",
  home: "Home",
  things: "Things",
  places: "Places",
  nature: "Nature",
  weather: "Weather",
  animals: "Animals",
  time: "Time",
  feelings: "Feelings",
  describing: "Describing words",
  colours: "Colours",
  verbs: "Verbs",
  numbers: "Numbers",
  learning: "Learning",
  everyday: "Everyday words",
};

export const TOPICS = Object.keys(TOPIC_LABELS) as Topic[];
