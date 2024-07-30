import pool from "../config/databaseConnector";
import userRepository from "../repository/userRepository";

class RoleService {
  async getRole(roleId: string) {
    try {
      const role = await userRepository.getUserRole(roleId);
      return role;
    } catch (error) {
      return error;
    }
  }
}

const roleService = new RoleService();
export default roleService;
