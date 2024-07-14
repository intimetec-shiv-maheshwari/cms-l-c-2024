import { pipeline } from "transformer.ts";
import sentimentAnalysis from "../SentimentAnalysis/sentimentAnalysis";
jest.mock("transformer.ts", () => ({
  pipeline: jest.fn().mockResolvedValue(() => {
    pipeline: jest.fn();
  }),
}));

describe("analyzeSentiment", () => {
  it("sentiment score for a given positive text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(() => {
      return Promise.resolve([{ label: "4", score: 0.43 }]);
    });
    const text = "It was good";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 6.86;
    expect(sentimentScore).toBe(expectedScore);
  });

  it("sentiment score for a give positive text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(() => {
      return Promise.resolve([{ label: "3", score: 0.69 }]);
    });
    const text = "It was ok";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 5.38;
    expect(sentimentScore).toBe(expectedScore);
  });

  it("sentiment score for a given negative text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(() => {
      return Promise.resolve([{ label: "1", score: 0.36 }]);
    });
    const text = "Not upto the mark";
    const sentimentScore = await sentimentAnalysis.analyzeSentiment(text);
    const expectedScore = 0.72;
    expect(sentimentScore).toBe(expectedScore);
  });

  it('should throw an error for a sentiment label of 6', async () => {
    (pipeline as jest.Mock).mockResolvedValueOnce(() => Promise.resolve([{ label: '6 stars', score: 0.5 }]));

    const text = 'Label out of bounds';
    await expect(await sentimentAnalysis.analyzeSentiment(text)).rejects.toThrow('Invalid sentiment label');
  });
});
