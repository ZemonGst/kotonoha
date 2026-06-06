import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";

export const useSubmitResponse = () => {
    const mutation = trpc.response.submitResponse.useMutation({
        retry: false, // Public route
    });

    return {
        submitAsync: mutation.mutateAsync,
        submit: mutation.mutate,
        error: mutation.error,
        isError: mutation.isError,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        status: mutation.status,
    };
};

export const useGetResponsesByPublishedForm = (publishedFormId: string, enabled = true) => {
    const {
        data: responses,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.response.getResponsesByPublishedForm.useQuery(
        { publishedFormId },
        {
            enabled: !!publishedFormId && enabled,
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        responses,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useGetResponseCount = (publishedFormId: string, enabled = true) => {
    const {
        data: responseCountData,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.response.getResponseCount.useQuery(
        { publishedFormId },
        {
            enabled: !!publishedFormId && enabled,
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        count: responseCountData?.count || 0,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};
