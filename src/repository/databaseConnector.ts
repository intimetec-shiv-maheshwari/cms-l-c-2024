import * as mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cafeteriams",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool