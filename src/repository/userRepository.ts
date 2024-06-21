import { FieldPacket, RowDataPacket } from "mysql2";
import { UserCredentials } from "../interface/User";
import pool from "./databaseConnector";

class UserRepository {
  async verifyUser(userCredentials: UserCredentials) {
    const { userId, password } = userCredentials;
    const values = [userId, password];
    const query = "SELECT * FROM t_user WHERE userId = ? and password = ?";
    try {
      const [result] = await pool.query(
        query,
        values
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
