import { error } from "console";
import notificationRepository from "../repository/notificationRepository";
import { FieldPacket, QueryResult } from "mysql2";
import { Notification } from "../interface/Menu";

class NotificationService {
  async saveNewNotification(
    notificationMessage: string,
    notificationType: number,
    receiverStatusCode: number
  ) {
    const notificationDetails = {
      message: notificationMessage,
      notificationType: notificationType,
      receiverStatusCode: receiverStatusCode,
    };
    try {
      const result: [QueryResult, FieldPacket[]] =
        await notificationRepository.insertNewNotification(notificationDetails);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNotifications(receiverStatusCode: number) {
    try {
      const result = await notificationRepository.getNotifications(
        receiverStatusCode
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
