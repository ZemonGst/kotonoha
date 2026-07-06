import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils/auth-interceptor";

export const useGetMe = () => {
    const {
        data: user,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    } = trpc.dashboard.getMe.useQuery(undefined, {
        retry: trpcAuthRetry,
        staleTime: 5 * 60 * 1000, // treat as fresh for 5 min — profile rarely changes
    });

    useAuthErrorInterceptor({ isError, error, refetch });

    return {
        user,
        error,
        isError,
        isLoading,
        isPending,
        isSuccess,
        status,
        refetch,
    };
};

export const useLogout = () => {
    const router = useRouter();

    const mutation = trpc.auth.logout.useMutation({
        retry: trpcAuthRetry,
        onSuccess: () => {
            router.push("/login");
        },
    });

    const refetch = () => {
        mutation.mutate();
    };

    useAuthErrorInterceptor({
        isError: mutation.isError,
        error: mutation.error,
        refetch
    });

    return {
        logoutAsync: mutation.mutateAsync,
        logout: mutation.mutate,
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
