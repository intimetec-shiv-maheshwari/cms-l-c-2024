import pool from "./databaseConnector";

class NotificationRepository {
  async insertNewNotification(notificationDetails: {
    message: string;
    notificationType: number;
    receiverStatusCode: number;
  }) {
    try {
      const { message, notificationType, receiverStatusCode } =
        notificationDetails;
      const query =
        " INSERT INTO t_notification (message, notificationType, receiverStatusCode) VALUES (?, ?, ?);";
      const result = await pool.query(query, [
        message,
        notificationType,
        receiverStatusCode,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNotifications(receiverStatusCode: number) {
    try {
      const query =
        "SELECT message FROM t_notification WHERE receiverStatusCode = ? OR receiverStatusCode = '3' AND ((notificationType IN (1, 2 ,4)) OR (notificationType = 3 AND createDate = CURRENT_DATE))";
      const [result] = await pool.query(query, [receiverStatusCode]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;
