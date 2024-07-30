import sentimentAnalysis from "../SentimentAnalysis/sentimentAnalysis";
import { Role } from "../interface/User";
import { DetailedFeedback, ItemFeedback } from "../interface/feedback";
import { employeeOptions } from "../interface/optionMapping";
import discardService from "../service/discardService";
import feedbackService from "../service/feedbackService";
import itemService from "../service/itemService";
import menuService from "../service/menuService";
import notificationService from "../service/notificationService";
export class Employee implements Role {
  getOptions(): string[] {
    return employeeOptions;
  }
  async voteForDesiredMeal(requestPayload: any) {
    const response = await menuService.incrementVoteForMeal(requestPayload);
    return response;
  }

  async saveFeedback(requestPayload: ItemFeedback) {
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
    const receiverStatusCode = 1;
    const result = await notificationService.getNotifications(
      receiverStatusCode
    );
    return result;
  }

  async saveDetailedFeedback(requestPayload: DetailedFeedback) {
    try {
      const { itemId, likes, dislikes, momsRecipe, userId } = requestPayload;
      const feedbackDetails = {
        itemId: itemId,
        likes: likes,
        dislikes: dislikes,
        momsRecipe: momsRecipe,
      };
      const response = await discardService.saveDetailedFeedbackForDiscardItem(
        feedbackDetails
      );
      const usageLog = await discardService.insertUsageLogForEmployee(userId!);
      return {
        success: true,
        message: "Operation Done Successfully!",
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

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?: any) => void } = {
      1: this.voteForDesiredMeal,
      2: this.saveFeedback,
      3: this.saveDetailedFeedback,
      4: this.viewNotification,
    };
    return optionsMap[option];
  }
}
