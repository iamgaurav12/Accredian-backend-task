import express from "express";
import { createReferral } from "../controllers/referral.controller";
const router = express.Router();

router.post("/create", createReferral, (req, res, next) => {
    res.status(200).send("Referral created successfully!");
});


export default router;
