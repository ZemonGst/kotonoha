import { useCallback } from "react";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils";

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
        saveDeltaAsync: mutation.mutateAsync,
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
