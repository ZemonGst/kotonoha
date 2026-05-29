import UserService from "@repo/services/user";
import OtpService from "@repo/services/otp";
import EmailService from "@repo/services/email";
import DashboardService from "@repo/services/dashboard";

export const userService = new UserService();
export const otpService = new OtpService();
export const emailService = new EmailService();
export const dashboardService = new DashboardService();
