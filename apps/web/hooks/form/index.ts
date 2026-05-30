import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils";

export const useCreateForm = () => {
    const mutation = trpc.form.createForm.useMutation({
        retry: trpcAuthRetry
    });

    useAuthErrorInterceptor({
        isError: mutation.isError,
        error: mutation.error,
        refetch: () => {
            if (mutation.variables) {
                mutation.mutate(mutation.variables);
            }
        }
    });

    return {
        createFormAsync: mutation.mutateAsync,
        createForm: mutation.mutate,
        error: mutation.error,
        isError: mutation.isError,
        failureCount: mutation.failureCount,
        isIdle: mutation.isIdle,
        isSuccess: mutation.isSuccess,
        variables: mutation.variables,
        status: mutation.status,
    };
};
