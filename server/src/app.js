import cors from "cors"
import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import purchaseOrderRouter from "./routes/purchaseOrder.routes.js"
 
app.use("/api/v1/users",userRouter)
app.use("/api/v1/users/admin",adminRouter)
app.use("/api/v1/purchaseOrder",purchaseOrderRouter)
 
export {app}