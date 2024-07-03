import sentimentAnalysis from "../SentimentAnalysis/sentimentAnalysis";
import { Role } from "../interface/User";
import { employeeOptions } from "../interface/optionMapping";
import feedbackService from "../service/feedbackService";
import itemService from "../service/itemService";
import menuService from "../service/menuService";
import notificationService from "../service/notificationService";
export class Employee implements Role {
  getOptions(): string[] {
    return employeeOptions;
  }
  async voteForDesiredMeal(requestPayload: any) {
    try {
      const response = await menuService.incrementVoteForMeal(requestPayload);
      return {
        success: true,
        message: "Voting Done Successfully!",
        type: "message",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async saveFeedback(requestPayload: any) {
    try {
      const feedbackResponse = await feedbackService.saveFeedback(
        requestPayload
      );
      const sentimentScore = await sentimentAnalysis.analyzeSentiment(
        requestPayload.feedback
      );
      const sentimentResponse = await itemService.updateSentimentScore(
        requestPayload.itemId,
        sentimentScore
      );
      const ratingResponse = await itemService.updateAverageRating(
        requestPayload.itemId,
        requestPayload.rating
      );
      return {
        success: true,
        message: "Feedback Done!",
        type: "message",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async viewNotification() {
    try {
      const receiverStatusCode = 1;
      const result = await notificationService.getNotifications(
        receiverStatusCode
      );
      return {
        success: true,
        message: result,
        type: "list",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?: any) => void } = {
      1: this.voteForDesiredMeal,
      2: this.saveFeedback,
      3: this.viewNotification,
    };
    return optionsMap[option];
  }
}
