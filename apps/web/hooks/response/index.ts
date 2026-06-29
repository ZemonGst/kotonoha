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

export const useExportResponsesCsv = () => {
    const mutation = trpc.form.exportResponsesCsv.useMutation({
        retry: trpcAuthRetry,
    });

    const exportCsv = async (publishedFormId: string) => {
        try {
            const { csv, filename } = await mutation.mutateAsync({ publishedFormId });
            
            // Programmatically download the CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (error) {
            console.error("Failed to export CSV:", error);
            return { success: false, error };
        }
    };

    return {
        exportCsv,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
