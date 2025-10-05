import pkg from "pg"
import  dotenv  from "dotenv";

const {Pool} = pkg

dotenv.config()

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
})

pool.on("connect",()=>{
    console.log("connected db")
})

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully");
    client.release(); 
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    throw err;
  }
};
export { pool,testConnection}