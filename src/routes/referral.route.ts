import express from "express";
import { createReferral } from "../controllers/referral.controller";
const router = express.Router();

router.post("/create", createReferral, (req, res, next) => {
    console.log(req);
    next();
});

export default router;