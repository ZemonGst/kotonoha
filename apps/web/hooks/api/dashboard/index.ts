import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { trpcAuthRetry, useAuthErrorInterceptor } from "~/hooks/utils";

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
        retry: trpcAuthRetry
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

    const {
        mutateAsync: logoutAsync,
        mutate: logout,
        error,
        isError,
        isPending,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status,
    } = trpc.auth.logout.useMutation({
        onSuccess: () => {
            router.push("/login");
        },
    });

    return {
        logoutAsync,
        logout,
        error,
        isError,
        isPending,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status,
    };
};
