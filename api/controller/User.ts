import { Request, Response } from "express";
import userModel from "../models/Users";
import { Voucher } from "../models/Voucher";
import { VoucherController } from "./Voucher";
import axios from "axios";

export class UserController {

  // Get all users
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving users", error });
    }
  }

 

  // Suspend a user
  static async suspendUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const user = await userModel.findByIdAndUpdate(
        userId,
        { suspended: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User suspended", user });
    } catch (error) {
      return res.status(500).json({ message: "Error suspending user", error });
    }
  }

  // Unsuspend a user
  static async unsuspendUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const user = await userModel.findByIdAndUpdate(
        userId,
        { suspended: false },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User unsuspended", user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error unsuspending user", error });
    }
  }

  // Get redeemed vouchers of a user
  static async getRedeemedVouchers(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const redeemedVouchers = user.vouchers.filter(
        (voucher) => voucher.redeemed
      );

      return res.status(200).json(redeemedVouchers);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving redeemed vouchers", error });
    }
  }

  // Get unredeemed vouchers of a user
  static async getUnredeemedVouchers(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const unredeemedVouchers = user.vouchers.filter(
        (voucher) => !voucher.redeemed
      );

      return res.status(200).json(unredeemedVouchers);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving unredeemed vouchers", error });
    }
  }


}
