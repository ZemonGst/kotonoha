import { db, eq, and, desc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { 
    GetAllFormsInputType, 
    getAllFormsInputSchema,
    getAllFormsOutputSchema 
} from "./model";

class DraftService {
    public async getAllForms(payload: GetAllFormsInputType) {
        const { userId, status } = await getAllFormsInputSchema.parseAsync(payload);

        let condition = eq(formsTable.createdBy, userId);
        if (status) {
            condition = and(eq(formsTable.createdBy, userId), eq(formsTable.status, status)) as any;
        }

        const results = await db
            .select()
            .from(formsTable)
            .where(condition)
            .orderBy(desc(formsTable.updatedAt));

        return getAllFormsOutputSchema.parseAsync(results);
    }
}

export default DraftService;
