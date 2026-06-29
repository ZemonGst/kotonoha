import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";

export const useDashboardAnalytics = () => {
    const {
        data: analytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.analytics.getDashboardAnalytics.useQuery(
        undefined,
        {
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        analytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useFormAnalytics = (formId: string) => {
    const {
        data: analytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.analytics.getFormAnalytics.useQuery(
        { formId },
        {
            retry: trpcAuthRetry,
            enabled: !!formId,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        analytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useResponseTrends = (formId?: string) => {
    const {
        data: trends,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.analytics.getResponseTrends.useQuery(
        { formId },
        {
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        trends,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useTopPerformingForms = () => {
    const {
        data: topForms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.analytics.getTopPerformingForms.useQuery(
        undefined,
        {
            retry: trpcAuthRetry,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        topForms,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useQuestionAnalytics = (formId: string) => {
    const {
        data: questionAnalytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.analytics.getQuestionAnalytics.useQuery(
        { formId },
        {
            retry: trpcAuthRetry,
            enabled: !!formId,
        }
    );

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        questionAnalytics,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};
