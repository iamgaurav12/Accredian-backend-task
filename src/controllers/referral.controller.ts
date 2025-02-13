import { Request, Response, NextFunction } from 'express';
import { errorHandler } from "../utils/error";
import { PrismaClient } from '@prisma/client';
import { sendReferralEmail } from '../emailService';

const prisma = new PrismaClient();

export const createReferral = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, referredBy } = req.body;

  if (!name || !email || !referredBy) {
    return next(errorHandler(400, "Missing fields"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email"));
  }

  try {
    const referral = await prisma.referral.create({
      data: { name, email, referredBy },
    });
  
    await sendReferralEmail(name, email, referredBy);
    res.status(201).json(referral);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return next(errorHandler(409, "Email already exists"));
    } else {
      return next(errorHandler(500, "An unexpected error occurred"));
    }
  }
  
};
