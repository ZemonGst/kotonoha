import { db, eq, and, asc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { publishedFormsTable } from "@repo/database/models/published-form";
import { env } from "../env";
import {
    PublishFormInputType,
    publishFormInputSchema,
    GetPublishedFormInputType,
    getPublishedFormSchema,
    publishedFormSchema,
    PublishedFormType
} from "./model";

export type PublishedFormWithUrlType = PublishedFormType & { url: string };

class PublishFormService {
    public generatePublicFormUrl(publishedFormId: string): string {
        return `${env.FRONTEND_URL}/forms/${publishedFormId}`;
    }


    public async publishForm(payload: PublishFormInputType): Promise<PublishedFormWithUrlType> {
        const { formId, userId, expiresAt } = await publishFormInputSchema.parseAsync(payload);

        return await db.transaction(async (tx) => {
            // Validate form exists and ownership
            const formResult = await tx
                .select({ id: formsTable.id, createdBy: formsTable.createdBy, status: formsTable.status })
                .from(formsTable)
                .where(
                    and(
                        eq(formsTable.id, formId),
                        eq(formsTable.createdBy, userId)
                    )
                );

            const form = formResult[0];
            if (!form) {
                throw new Error("Form not found or you do not have permission to publish it");
            }

            if (form.status !== "draft") {
                throw new Error("Only draft forms can be published");
            }

            // Create published_forms row
            const insertResult = await tx
                .insert(publishedFormsTable)
                .values({
                    formId,
                    publishedBy: userId,
                    expiresAt: expiresAt ?? null,
                })
                .returning();

            if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
                throw new Error("Something went wrong while publishing the form");
            }

            // Update forms.status = active
            await tx
                .update(formsTable)
                .set({ status: "active", updatedAt: new Date() })
                .where(eq(formsTable.id, formId));

            const parsedForm = await publishedFormSchema.parseAsync(insertResult[0]);
            
            return {
                ...parsedForm,
                url: this.generatePublicFormUrl(parsedForm.id)
            };
        });
    }

    public async getPublishedFormById(payload: GetPublishedFormInputType): Promise<PublishedFormType> {
        const { id } = await getPublishedFormSchema.parseAsync(payload);

        const result = await db
            .select()
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.id, id));

        if (!result || result.length === 0 || !result[0]) {
            throw new Error("Published form not found");
        }

        return publishedFormSchema.parseAsync(result[0]);
    }

    public async getPublicFormWithFields(payload: GetPublishedFormInputType) {
        const { id } = await getPublishedFormSchema.parseAsync(payload);

        const publishedResult = await db
            .select()
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.id, id));

        if (!publishedResult || publishedResult.length === 0 || !publishedResult[0]) {
            throw new Error("Published form not found");
        }

        const publishedForm = publishedResult[0];

        const formResult = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, publishedForm.formId));

        if (!formResult || formResult.length === 0 || !formResult[0]) {
            throw new Error("Form not found");
        }

        const baseForm = formResult[0];

        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, baseForm.id))
            .orderBy(asc(formFieldsTable.order));

        return {
            id: publishedForm.id,
            formId: baseForm.id,
            title: baseForm.title,
            description: baseForm.description,
            status: baseForm.status,
            expiresAt: publishedForm.expiresAt,
            fields: fields.map(f => ({ ...f, order: Number(f.order) }))
        };
    }

    public async getPublishedFormsByUser(userId: string): Promise<PublishedFormType[]> {
        const result = await db
            .select()
            .from(publishedFormsTable)
            .where(eq(publishedFormsTable.publishedBy, userId));

        return Promise.all(result.map(row => publishedFormSchema.parseAsync(row)));
    }

    public async endPublishedForm(formId: string, userId: string): Promise<boolean> {
        return await db.transaction(async (tx) => {
            // Validate form exists and ownership
            const formResult = await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(
                    and(
                        eq(formsTable.id, formId),
                        eq(formsTable.createdBy, userId)
                    )
                );

            if (!formResult || formResult.length === 0) {
                throw new Error("Form not found or you do not have permission to end it");
            }

            // Update forms.status = archived
            await tx
                .update(formsTable)
                .set({ status: "archived", updatedAt: new Date() })
                .where(eq(formsTable.id, formId));

            return true;
        });
    }
}

export default PublishFormService;
