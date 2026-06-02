import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { formService } from "../../services";

import {
    createFormInputSchema,
    createFormOutputSchema,
    getFormByIdInputSchema,
    getFormByIdOutputSchema,
    updateFormStatusInputSchema,
    updateFormStatusOutputSchema,
    createFieldInputSchema,
    createFieldOutputSchema,
    getFieldsInputSchema,
    getFieldsOutputSchema,
    updateFieldInputSchema,
    updateFieldOutputSchema,
    deleteFieldInputSchema,
    deleteFieldOutputSchema,
    saveDeltaInputSchema,
    saveDeltaOutputSchema,
    deleteFormInputSchema,
    deleteFormOutputSchema,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

// Every route in this router is a POST under /form — postMeta
// captures the repeated openapi shape so each procedure only declares its path + summary.
function postMeta(path: string, summary: string) {
    return {
        openapi: {
            method: "POST" as const,
            path: getPath(path),
            tags: TAGS,
            summary,
        },
    };
}

function getMeta(path: string, summary: string) {
    return {
        openapi: {
            method: "GET" as const,
            path: getPath(path),
            tags: TAGS,
            summary,
        },
    };
}

export const formRouter = router({
    // Create form
    createForm: protectedProcedure
        .meta(postMeta("/createForm", "Create a new form"))
        .input(createFormInputSchema)
        .output(createFormOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            // Pass the authenticated userId and the validated input to the form service
            const form = await formService.createForm(userId, input);
            
            return form;
        }),

    // Get form by ID
    getFormById: protectedProcedure
        .meta(getMeta("/getFormById", "Get a form by its ID"))
        .input(getFormByIdInputSchema)
        .output(getFormByIdOutputSchema)
        .query(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            const form = await formService.getFormById({
                formId: input.formId,
                userId: userId,
            });
            
            return form;
        }),

    // Update form status
    updateFormStatus: protectedProcedure
        .meta(postMeta("/updateFormStatus", "Update the status of a form"))
        .input(updateFormStatusInputSchema)
        .output(updateFormStatusOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            const form = await formService.updateFormStatus({
                formId: input.formId,
                userId: userId,
                status: input.status,
            });
            
            return form;
        }),

    // Create field
    createField: protectedProcedure
        .meta(postMeta("/createField", "Create a new field inside a form"))
        .input(createFieldInputSchema)
        .output(createFieldOutputSchema)
        .mutation(async ({ input }) => {
            // Note: formService.createField already checks form existence.
            const field = await formService.createField(input);
            return field;
        }),

    // Get fields
    getFields: protectedProcedure
        .meta(getMeta("/getFields", "Load all fields belonging to a form"))
        .input(getFieldsInputSchema)
        .output(getFieldsOutputSchema)
        .query(async ({ input }) => {
            const fields = await formService.getFields({ formId: input.formId });
            return fields;
        }),

    // Update field
    updateField: protectedProcedure
        .meta(postMeta("/updateField", "Update editable field properties"))
        .input(updateFieldInputSchema)
        .output(updateFieldOutputSchema)
        .mutation(async ({ input }) => {
            const field = await formService.updateField(input);
            return field;
        }),

    // Delete field
    deleteField: protectedProcedure
        .meta(postMeta("/deleteField", "Delete a field"))
        .input(deleteFieldInputSchema)
        .output(deleteFieldOutputSchema)
        .mutation(async ({ input }) => {
            await formService.deleteField(input);
            return true;
        }),

    // Save delta
    saveDelta: protectedProcedure
        .meta(postMeta("/saveDelta", "Persist builder changes using delta updates"))
        .input(saveDeltaInputSchema)
        .output(saveDeltaOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            // Reconstruct the payload to pass userId which saveDelta requires
            const result = await formService.saveDelta({
                ...input,
                userId,
            });
            
            return result;
        }),

    // Delete form
    deleteForm: protectedProcedure
        .meta(postMeta("/deleteForm", "Delete a form"))
        .input(deleteFormInputSchema)
        .output(deleteFormOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            
            await formService.deleteForm({
                formId: input.formId,
                userId: userId,
            });
            
            return true;
        }),
});
