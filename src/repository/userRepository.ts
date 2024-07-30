import { FieldPacket, RowDataPacket } from "mysql2";
import { UserCredentials } from "../interface/User";
import pool from "../config/databaseConnector";

class UserRepository {
  async verifyUser(userCredentials: UserCredentials) {
    const { userId, password } = userCredentials;
    const values = [userId, password];
    const query = "SELECT * FROM t_user WHERE userId = ? and password = ?";
    try {
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query,
        values
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUserRole(roleId: string) {
    try {
      const values = [roleId];
      const [userRole]: any = await pool.query(
        "Select role from t_role where id = ?",
        values
      );
      return userRole[0].role;
    } catch (error) {
      return error;
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
