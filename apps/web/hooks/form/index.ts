import { useCallback } from "react";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";
import { useRefreshAccessToken } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";

export const useCreateForm = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.form.createForm.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
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

export const useGetFormById = (formId: string) => {
    const {
        data: form,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.form.getFormById.useQuery(
        { formId },
        {
            retry: trpcAuthRetry,
            enabled: !!formId,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        form,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useGetFields = (formId: string) => {
    const {
        data: fields,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.form.getFields.useQuery(
        { formId },
        {
            retry: trpcAuthRetry,
            enabled: !!formId,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        fields,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useCreateField = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.form.createField.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
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
        createFieldAsync: mutation.mutateAsync,
        createField: mutation.mutate,
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

export const useUpdateField = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.form.updateField.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
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
        updateFieldAsync: mutation.mutateAsync,
        updateField: mutation.mutate,
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

export const useDeleteField = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.form.deleteField.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
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
        deleteFieldAsync: mutation.mutateAsync,
        deleteField: mutation.mutate,
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

export const useSaveDelta = (options?: { onSuccess?: (data: any) => void }) => {
    const mutation = trpc.form.saveDelta.useMutation({
        retry: trpcAuthRetry,
        onSuccess: options?.onSuccess,
    });

    const { refreshAccessTokenAsync } = useRefreshAccessToken();
    const router = useRouter();

    const saveDeltaAsync = useCallback(async (payload: any) => {
        console.log('[useSaveDelta] save start');
        try {
            const result = await mutation.mutateAsync(payload);
            console.log('[useSaveDelta] final result (success without refresh)');
            return result;
        } catch (error: any) {
            const isUnauthorized = error?.data?.code === 'UNAUTHORIZED' || error?.message?.includes('UNAUTHORIZED') || error?.message?.includes('Access token not found');
            
            if (isUnauthorized) {
                console.log('[useSaveDelta] unauthorized detected');
                try {
                    await refreshAccessTokenAsync();
                    console.log('[useSaveDelta] refresh success');
                    
                    console.log('[useSaveDelta] retry start');
                    const retryResult = await mutation.mutateAsync(payload);
                    console.log('[useSaveDelta] retry success');
                    console.log('[useSaveDelta] final result after retry');
                    return retryResult;
                } catch (retryOrRefreshError) {
                    console.error('[useSaveDelta] refresh or retry failed', retryOrRefreshError);
                    router.push('/login');
                    throw error;
                }
            }
            throw error;
        }
    }, [mutation.mutateAsync, refreshAccessTokenAsync, router]);

    return {
        saveDeltaAsync,
        saveDelta: mutation.mutate,
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
