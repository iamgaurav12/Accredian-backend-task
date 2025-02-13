import { Request, Response, NextFunction } from 'express';
import { errorHandler } from "../utils/error";
import { PrismaClient } from '@prisma/client';
import { sendReferralEmail } from '../emailService';

const prisma = new PrismaClient();

export const createReferral = async (req: Request, res: Response, next: NextFunction) => {
  console.log("📥 Received request to create referral");
  console.log("➡️ Request body:", req.body);

  const { name, email, referredBy } = req.body;

  if (!name || !email || !referredBy) {
    console.warn("❌ Missing fields:", { name, email, referredBy });
    return next(errorHandler(400, "Missing fields"));  // ✅ Fix: Pass error to `next()`
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.warn("❌ Invalid email format:", email);
    return next(errorHandler(400, "Invalid email"));  // ✅ Fix: Pass error to `next()`
  }

  try {
    console.log("🔍 Checking if referral already exists...");
    const existingReferral = await prisma.referral.findUnique({ where: { email } });

    if (existingReferral) {
      console.warn("⚠️ Email already exists in DB:", email);
      return next(errorHandler(409, "Email already exists"));  // ✅ Fix
    }

    console.log("🛠 Creating new referral...");
    const referral = await prisma.referral.create({
      data: { name, email, referredBy },
    });

    console.log("📧 Sending referral email...");
    await sendReferralEmail(name, email, referredBy);

    console.log("✅ Referral created successfully:", referral);
    res.status(201).json(referral);
  } catch (error: any) {
    console.error("❌ Error in createReferral:", error);

    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return next(errorHandler(409, "Email already exists"));  // ✅ Fix
    } else {
      return next(errorHandler(500, "An unexpected error occurred"));  // ✅ Fix
    }
  }
};

