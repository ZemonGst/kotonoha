import { useCallback } from "react";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";

export const useGetAllForms = (status?: "draft" | "active" | "archived") => {
    const {
        data: forms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status: queryStatus,
        refetch,
    } = trpc.draft.getAllForms.useQuery(
        { status },
        {
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        forms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        queryStatus,
        refetch,
    };
};
