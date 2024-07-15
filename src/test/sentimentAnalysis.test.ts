import { pipeline } from "transformer.ts";
import sentimentAnalysis from "../SentimentAnalysis/sentimentAnalysis";

jest.mock("transformer.ts", () => ({
  pipeline: jest.fn(),
}));

describe("analyzeSentiment", () => {
  it("should return correct sentiment score for a given positive text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "4", score: 0.43 }]);
    const text = "It was good";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 6.86;
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return correct sentiment score for a given neutral text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "3", score: 0.69 }]);
    const text = "It was ok";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 5.38;
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return correct sentiment score for a given negative text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "1", score: 0.36 }]);
    const text = "Not up to the mark";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 0.72;
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should throw an error for a sentiment label of 6", async () => {
    (pipeline as jest.Mock).mockResolvedValueOnce(async () => [{ label: "6", score: 0.5 }]);

    const text = "Label out of bounds";
    await expect(sentimentAnalysis.analyzeSentiment(text)).rejects.toThrow("Invalid sentiment label");
  });

  it("should return correct sentiment score for a sentiment label of 1 with a low score", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "1", score: 0.1 }]);
    const text = "Very bad";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 0.2; 
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return correct sentiment score for a sentiment label of 5 with a high score", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "5", score: 0.9 }]);
    const text = "Absolutely fantastic!";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 9.8; 
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return 0 for an empty text input", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "3", score: 0.5 }]);
    const text = "";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 5; 
    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return correct sentiment score for a neutral sentiment", async () => {
    (pipeline as jest.Mock).mockResolvedValue(async () => [{ label: "3", score: 0.5 }]);
    const text = "The experience was average.";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 5; 
    expect(sentimentScore).toBe(expectedScore);
  });
});
