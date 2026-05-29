import { useRouter } from "next/navigation";

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
    } = trpc.dashboard.getMe.useQuery();

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
