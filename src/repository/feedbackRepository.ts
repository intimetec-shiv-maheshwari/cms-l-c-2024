import pool from "./databaseConnector";

class FeedbackRepository {
  async insertFeedback(feedbackDetails: {
    userId: any;
    itemId: any;
    rating: any;
    feedback: any;
  }) {
    try {
      const { userId, itemId, rating, feedback } = feedbackDetails;
      const query =
        "INSERT INTO t_feedback (userId, rating, itemId, comment) VALUES (?,?,?,?)";
      const result = await pool.query(query, [
        userId,
        rating,
        itemId,
        feedback,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const feedbackRepository = new FeedbackRepository();
export default feedbackRepository;
