import feedbackRepository from "../repository/feedbackRepository";

class FeedbackSerice {
  async saveFeedback(feedbackDetails: any) {
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
