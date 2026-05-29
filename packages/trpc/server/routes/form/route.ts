import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import { formService } from "../../services";

import {
    createFormInputSchema,
    createFormOutputSchema,
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
});
