import { ItemFeedback } from "../interface/feedback";
import feedbackRepository from "../repository/feedbackRepository";

class FeedbackSerice {
  async saveFeedback(feedbackDetails: ItemFeedback) {
    try {
      const response = await feedbackRepository.insertFeedback(feedbackDetails);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const feedbackService = new FeedbackSerice();
export default feedbackService;
