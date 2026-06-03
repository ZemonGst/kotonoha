import { useCallback } from "react";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";
import { useRefreshAccessToken } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";

export const useGetAllTemplates = () => {
    const {
        data: templates,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.defaultTemplate.getAllTemplates.useQuery(
        undefined,
        {
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        templates,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useGetTemplatePreview = (templateId: string | null) => {
    const {
        data: previewData,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.defaultTemplate.getTemplatePreview.useQuery(
        { templateId: templateId! },
        {
            retry: trpcAuthRetry,
            enabled: !!templateId, // Only run the query when a templateId is actually provided
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        previewData,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useCloneTemplate = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.defaultTemplate.cloneTemplate.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
    });

    const { refreshAccessTokenAsync } = useRefreshAccessToken();
    const router = useRouter();

    const cloneTemplateAsync = useCallback(async (payload: any) => {
        try {
            return await mutation.mutateAsync(payload);
        } catch (error: any) {
            const isUnauthorized = error?.data?.code === 'UNAUTHORIZED' || error?.message?.includes('UNAUTHORIZED') || error?.message?.includes('Access token not found');
            
            if (isUnauthorized) {
                try {
                    await refreshAccessTokenAsync();
                    const retryResult = await mutation.mutateAsync(payload);
                    return retryResult;
                } catch (retryOrRefreshError) {
                    router.push('/login');
                    throw error;
                }
            }
            throw error;
        }
    }, [mutation.mutateAsync, refreshAccessTokenAsync, router]);

    return {
        cloneTemplateAsync,
        cloneTemplate: mutation.mutate,
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
