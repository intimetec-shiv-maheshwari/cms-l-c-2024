import discardRepository from "../repository/discardRepository";
import notificationService from "./notificationService";

class DiscardService {
  async checkForUsageHistory(option: number) {
    try {
      const response = await discardRepository.checkForUsageHistory(option);
      return response;
    } catch (error) {
      return error;
    }
  }

  async checkForUserHistory(userId: string) {
    try {
      const response = await discardRepository.checkForUserHistory(userId);
      return response;
    } catch (error) {
      return error;
    }
  }

  async showDiscardItemList() {
    try {
      const response = await discardRepository.showDiscardItemList();
      return response;
    } catch (error) {
      return error;
    }
  }

  async insertUsageLog(actionType: number, userId: string) {
    try {
      console.log(actionType);
      const response = await discardRepository.insertUsageLog(
        actionType,
        userId
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  async saveDetailedFeedbackForDiscardItem(feedbackDetails: {
    itemId: any;
    likes: any;
    dislikes: any;
    momsRecipe: any;
  }) {
    try {
      const response =
        await discardRepository.saveDetailedFeedbackForDiscardItem(
          feedbackDetails
        );
    } catch (error) {
      throw error;
    }
  }

  async insertDiscardFeedbackItem(itemId: number) {
    try {
      const response = await discardRepository.insertDiscardFeedbackItem(
        itemId
      );
      const notificationDetails = {
        message: `We are trying to improve your experience with the food.Please provide your feedback by giving detailed feedback and help us.`,
        notificationType: 4,
        receiverStatusCode: 1,
      };
      const notificationResult = await notificationService.saveNewNotification(
        notificationDetails
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async insertUsageLogForEmployee(userId: string) {
    try {
      const response = await discardRepository.insertUsageLogForEmployee(
        userId
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const discardService = new DiscardService();
export default discardService;
