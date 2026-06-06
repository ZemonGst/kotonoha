import { db, and, eq, lt, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { publishedFormsTable } from "@repo/database/models/published-form";

class ExpirationService {
    public async checkExpiredPublishedForms(): Promise<number> {
        let archivedCount = 0;

        await db.transaction(async (tx) => {
            // Find active forms with expired published records
            // We need forms.status = 'active'
            // and published_forms.expiresAt < now()
            
            // To do this efficiently, we can use a subquery or join,
            // but for Drizzle we can select the forms that need archiving:
            const expiredRecords = await tx
                .select({ formId: publishedFormsTable.formId })
                .from(publishedFormsTable)
                .innerJoin(formsTable, eq(publishedFormsTable.formId, formsTable.id))
                .where(
                    and(
                        eq(formsTable.status, "active"),
                        lt(publishedFormsTable.expiresAt, new Date())
                    )
                );

            if (expiredRecords.length === 0) {
                return;
            }

            const formIdsToArchive = expiredRecords.map(record => record.formId);

            // Update forms.status = archived
            for (const formId of formIdsToArchive) {
                await tx
                    .update(formsTable)
                    .set({ status: "archived", updatedAt: new Date() })
                    .where(eq(formsTable.id, formId));
            }

            archivedCount = formIdsToArchive.length;
        });

        return archivedCount;
    }
}

export default ExpirationService;
