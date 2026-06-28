import cron from "node-cron";
import { logger } from "@repo/logger";
import ExpirationService from "@repo/services/expiration";

const expirationService = new ExpirationService();

export const setupCronJobs = () => {
    // Run every minute
    cron.schedule("* * * * *", async () => {
        try {
            logger.debug("[Cron] Heartbeat: Checking for expired published forms...");
            const count = await expirationService.checkExpiredPublishedForms();
            if (count > 0) {
                logger.info(`[Cron] Archived ${count} expired published forms.`);
            }
        } catch (error) {
            logger.error(`[Cron] Error checking expired forms`, { error });
        }
    });

    logger.info("[Cron] Scheduled jobs initialized");
};
