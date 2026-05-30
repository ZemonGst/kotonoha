import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRefreshAccessToken } from "~/hooks/api/auth";

import { trpc } from "~/trpc/client";

export const useGetMe = () => {
    const {
        data: user,
        error,
        isError,
        isLoading,
        isSuccess,
        status,
        refetch,
    } = trpc.dashboard.getMe.useQuery(undefined, {
        retry: (failureCount, error: any) => {
            const isUnauthorized = error?.data?.code === 'UNAUTHORIZED' || error?.message?.includes('UNAUTHORIZED') || error?.message?.includes('Access token not found');
            if (isUnauthorized) return false;
            return failureCount < 3;
        }
    });

    const { refreshAccessTokenAsync } = useRefreshAccessToken();
    const router = useRouter();

    useEffect(() => {
        if (isError && error) {
            console.log("useGetMe error intercepted:", error);
            const isUnauthorized = (error as any)?.data?.code === 'UNAUTHORIZED' || (error as any)?.message?.includes('UNAUTHORIZED') || (error as any)?.message?.includes('Access token not found');
            
            if (isUnauthorized) {
                console.log("UNAUTHORIZED detected. Attempting to refresh token...");
                refreshAccessTokenAsync()
                    .then(() => {
                        console.log("Token refreshed successfully. Retrying query...");
                        refetch();
                    })
                    .catch((err) => {
                        console.error("Token refresh failed. Redirecting to login...", err);
                        router.push('/login');
                    });
            }
        }
    }, [isError, error, refreshAccessTokenAsync, refetch, router]);

    return {
        user,
        error,
        isError,
        isLoading,
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
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status,
    };
};
