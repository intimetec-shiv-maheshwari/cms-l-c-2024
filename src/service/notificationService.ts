import { error } from "console";
import notificationRepository from "../repository/notificationRepository";

class NotificationService {
  async saveNewNotification(notificationDetails: {
    message: string;
    notificationType: number;
    receiverStatusCode: number;
  }) {
    try {
      const result = await notificationRepository.insertNewNotification(
        notificationDetails
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNotifications(receiverStatusCode: number) {
    try {
      const result = await notificationRepository.getNotifications(receiverStatusCode);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
