import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/db.js";
import { app } from "./app.js";

// Handle unexpected errors (good practice)
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION ❌:", err);
    process.exit(1);
});

connectDB()
.then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED ❌:", err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION ❌:", err);
    process.exit(1);
});