import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";

export const usePublishForm = () => {
    const mutation = trpc.publishForm.publishForm.useMutation({
        retry: trpcAuthRetry,
    });

    const refetch = () => {
        // refetch logic isn't easily mapped for mutations without caching the last variables, 
        // but useAuthErrorInterceptor expects it optionally.
        if (mutation.variables) {
            mutation.mutate(mutation.variables);
        }
    };

    useAuthErrorInterceptor({
        isError: mutation.isError,
        error: mutation.error,
        refetch
    });

    return {
        publishAsync: mutation.mutateAsync,
        publish: mutation.mutate,
        data: mutation.data,
        error: mutation.error,
        isError: mutation.isError,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        status: mutation.status,
    };
};

export const usePublishedForms = () => {
    const {
        data: forms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.publishForm.getMyPublishedForms.useQuery(undefined, {
        retry: trpcAuthRetry,
    });

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        forms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useEndPublishedForm = () => {
    const mutation = trpc.publishForm.endPublishedForm.useMutation({
        retry: trpcAuthRetry,
    });

    const refetch = () => {
        if (mutation.variables) {
            mutation.mutate(mutation.variables);
        }
    };

    useAuthErrorInterceptor({
        isError: mutation.isError,
        error: mutation.error,
        refetch
    });

    return {
        endFormAsync: mutation.mutateAsync,
        endForm: mutation.mutate,
        error: mutation.error,
        isError: mutation.isError,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        status: mutation.status,
    };
};

export const useGetPublishedFormById = (id: string, enabled = true) => {
    const {
        data: form,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.publishForm.getPublishedFormById.useQuery(
        { id },
        {
            enabled: !!id && enabled,
            retry: false, // Public route, no auth retry needed for unauthorized
        }
    );

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

export const useGetPublicFormWithFields = (id: string, enabled = true) => {
    const {
        data: form,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.publishForm.getPublicFormWithFields.useQuery(
        { id },
        {
            enabled: !!id && enabled,
            retry: false, // Public route
        }
    );

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
