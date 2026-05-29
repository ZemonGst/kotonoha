import UserService from "../user";

import { getMeOutputSchema } from "./model";

class DashboardService {
    private userService = new UserService();


    // Public methods
 public async getMe(userId: string) {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return getMeOutputSchema.parseAsync(user);
    }
}

export default DashboardService;
