import { db, eq, and, desc, notInArray } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { defaultTemplatesTable } from "@repo/database/models/default_templates";
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

        const templateForms = await db.select({ formId: defaultTemplatesTable.formId }).from(defaultTemplatesTable);
        const templateFormIds = templateForms.map(t => t.formId);

        if (templateFormIds.length > 0) {
            condition = and(condition, notInArray(formsTable.id, templateFormIds)) as any;
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
