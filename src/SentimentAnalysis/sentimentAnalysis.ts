import { pipeline } from "transformer.ts";

class SentimentAnalyzer {
  async analyzeSentiment(text: string): Promise<number> {
    const classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/bert-base-multilingual-uncased-sentiment"
    );
    const result: any = await classifier(text);
    const sentiment = result[0];
    const star = parseInt(sentiment.label[0]);

    if (star < 1 || star > 5) {
      throw new Error("Invalid sentiment label");
    }
    const minScore = (star - 1) * 2;
    const maxScore = star * 2;
    const scaledScore = minScore + (maxScore - minScore) * sentiment.score;

    return parseFloat(scaledScore.toFixed(2));
  }
}
const sentimentAnalysis = new SentimentAnalyzer();
export default sentimentAnalysis;
