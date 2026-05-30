import { useCallback } from "react";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils";

export const useCreateForm = () => {
    const mutation = trpc.form.createForm.useMutation({
        retry: trpcAuthRetry
    });

    const refetch = useCallback(() => {
        if (mutation.variables) {
            mutation.mutate(mutation.variables);
        }
    }, [mutation.variables, mutation.mutate]);

    useAuthErrorInterceptor({
        isError: mutation.isError,
        error: mutation.error,
        refetch
    });

    return {
        createFormAsync: mutation.mutateAsync,
        createForm: mutation.mutate,
        error: mutation.error,
        isError: mutation.isError,
        isPending: mutation.isPending,
        failureCount: mutation.failureCount,
        isIdle: mutation.isIdle,
        isSuccess: mutation.isSuccess,
        variables: mutation.variables,
        status: mutation.status,
    };
};
