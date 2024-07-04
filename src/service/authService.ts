import { FieldPacket, RowDataPacket } from "mysql2";
import { Admin } from "../controller/adminController";
import { Chef } from "../controller/chefController";
import { Employee } from "../controller/employeeController";
import { User } from "../controller/userController";
import { Role, UserCredentials } from "../interface/User";
import pool from "../repository/databaseConnector";
import roleService from "./roleService";
import userRepository from "../repository/userRepository";

class AuthService {
  async login(userCredentials: UserCredentials) {
    try {
      const result = await userRepository.verifyUser(userCredentials);
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
            userRole,
            role
          );
          return user;
        } else {
          return { success: false, message: "Invalid Role" };
        }
      } else {
        return { success: false, message: "Invalid userId or password" };
      }
    } catch (error) {
      return { success: false, message: error };
    }
  }
}

const authService = new AuthService();
export default authService;
