import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRefreshAccessToken } from "~/hooks/api/auth";

export const trpcAuthRetry = (failureCount: number, error: any) => {
    const isUnauthorized = error?.data?.code === 'UNAUTHORIZED' || error?.message?.includes('UNAUTHORIZED') || error?.message?.includes('Access token not found');
    if (isUnauthorized) return false;
    return failureCount < 3;
};

export const useAuthErrorInterceptor = ({ 
    isError, 
    error, 
    refetch 
}: { 
    isError: boolean; 
    error: any; 
    refetch?: () => void;
}) => {
    const { refreshAccessTokenAsync } = useRefreshAccessToken();
    const router = useRouter();

    useEffect(() => {
        if (isError && error) {
            const isUnauthorized = (error as any)?.data?.code === 'UNAUTHORIZED' || (error as any)?.message?.includes('UNAUTHORIZED') || (error as any)?.message?.includes('Access token not found');
            
            if (isUnauthorized) {
                refreshAccessTokenAsync()
                    .then(() => {
                        if (refetch) {
                            refetch();
                        }
                    })
                    .catch((err) => {
                        router.push('/login');
                    });
            }
        }
    }, [isError, error, refreshAccessTokenAsync, refetch, router]);
};
