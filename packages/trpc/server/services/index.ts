import UserService from "@repo/services/user";
import OtpService from "@repo/services/otp";
import EmailService from "@repo/services/email";
import DashboardService from "@repo/services/dashboard";
import FormService from "@repo/services/form";
import DraftService from "@repo/services/draft";
import DefaultTemplateService from "@repo/services/default-template";

export const userService = new UserService();
export const otpService = new OtpService();
export const emailService = new EmailService();
export const dashboardService = new DashboardService();
export const formService = new FormService();
export const draftService = new DraftService();
export const defaultTemplateService = new DefaultTemplateService();
