import { z } from "zod";
import { 
    submitResponseInputSchema, 
    getResponsesInputSchema,
    responseSchema
} from "../../../../services/response/model";

export const submitResponseRouteInputSchema = submitResponseInputSchema;
export const submitResponseRouteOutputSchema = z.object({ success: z.boolean() });

export const getResponsesRouteInputSchema = getResponsesInputSchema;
export const getResponsesRouteOutputSchema = z.array(responseSchema);

export const getResponseCountRouteInputSchema = getResponsesInputSchema;
export const getResponseCountRouteOutputSchema = z.object({ count: z.number() });
