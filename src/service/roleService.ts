import pool from "../repository/databaseConnector";

class RoleService {
//   role: string;

  async getRole(roleId: string) {
    const values = [roleId];
    const [userRole] : any= await pool.query(
      "Select role from t_role where id = ?",
      values
    );
    console.log(userRole)
    return userRole[0].role;
  }
}

const roleService = new RoleService();
export default roleService;
