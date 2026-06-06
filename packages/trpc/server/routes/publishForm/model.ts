import { z } from "zod";
import { 
    publishFormInputSchema, 
    publishedFormSchema,
    getPublishedFormSchema
} from "../../../../services/publishForm/model";

export const publishFormRouteInputSchema = publishFormInputSchema.omit({ userId: true });
export const publishFormRouteOutputSchema = publishedFormSchema.extend({ url: z.string() });

export const getMyPublishedFormsOutputSchema = z.array(publishedFormSchema);

export const endPublishedFormRouteInputSchema = z.object({ formId: z.string().uuid() });
export const endPublishedFormRouteOutputSchema = z.object({ success: z.boolean() });

export const getPublishedFormByIdRouteInputSchema = getPublishedFormSchema;
export const getPublishedFormByIdRouteOutputSchema = publishedFormSchema;
