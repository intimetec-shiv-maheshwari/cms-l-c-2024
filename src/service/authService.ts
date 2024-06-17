import { FieldPacket, RowDataPacket } from "mysql2";
import { Admin } from "../controller/AdminController";
import { Chef } from "../controller/chefController";
import { Employee } from "../controller/employeeController";
import { User } from "../controller/userController";
import { Role, UserCredentials } from "../interface/User";
import pool from "../repository/databaseConnector";
import roleService from "./roleService";

class AuthService {
  async login(userCredentials: UserCredentials) {
    const { userId, password } = userCredentials;
    const values = [userId, password];
    const query = "SELECT * FROM t_user WHERE userId = ? and password = ?";
    try {
      const [result]: [RowDataPacket[] , FieldPacket[]] = await pool.query(query, values);
      if (result.length > 0) {
        const userData = result[0];
        let userRole: string, role: Role;
        if (userData.roleId) {
          userRole = await roleService.getRole(userData.roleId);
          switch (userRole) {
            case "admin":
              role = new Admin();
              break;
            case "chef":
              role = new Chef();
              break;
            case "employee":
              role = new Employee();
              break;
            default:
              return { success: false, message: "Invalid role" };
          }
          const user = new User(
            userData.id,
            userData.name,
            userData.userId,
            role
          );
          return user;
        } else {
          return "Invalid userId or password";
        }
      }
    } catch (err) {
      console.error("Error executing query", err);
      return "Database error";
    }
  }
}

const authService = new AuthService();
export default authService;
