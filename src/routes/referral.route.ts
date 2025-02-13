import express from "express";
import { createReferral } from "../controllers/referral.controller";

const router = express.Router();

router.post("/create", async (req, res, next) => {
    try {
        console.log("📥 Incoming request to /api/referral/create");
        console.log("➡️ Request body:", req.body);

        await createReferral(req, res);  // Call the function properly

        console.log("✅ Referral created successfully!");
    } catch (error) {
        console.error("❌ Error in /api/referral/create:", error);
        next(error);  // Pass the error to Express error handler
    }
});

export default router;
