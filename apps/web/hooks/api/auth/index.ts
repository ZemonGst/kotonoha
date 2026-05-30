import { trpc } from "~/trpc/client"

export const useSignup = () => {
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error: error,
        isError: isError,
        failureCount: failureCount,
        isIdle: isIdle,
        isSuccess: isSuccess,
        variables: variables,
        status: status,
    } = trpc.auth.createUserWithEmailAndPassword.useMutation();

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status
    }
}

export const useVerifyOTP = () => {
    const {
        mutateAsync: verifyOtpAsync,
        mutate: verifyOtp,
        error: error,
        isError: isError,
        failureCount: failureCount,
        isIdle: isIdle,
        isSuccess: isSuccess,
        variables: variables,
        status: status,
    } = trpc.auth.verifyOtp.useMutation();

    return {
        verifyOtpAsync,
        verifyOtp,
        error,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status
    }
}

export const useResendOTP = () => {
    const {
        mutateAsync: resendOtpAsync,
        mutate: resendOtp,
        error: error,
        isError: isError,
        failureCount: failureCount,
        isIdle: isIdle,
        isSuccess: isSuccess,
        variables: variables,
        status: status,
    } = trpc.auth.resendOtp.useMutation();

    return {
        resendOtpAsync,
        resendOtp,
        error,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status
    }
}

export const useSignin = () => {
    const {
        mutateAsync: signInWithEmailAndPasswordAsync,
        mutate: signInWithEmailAndPassword,
        error: error,
        isError: isError,
        failureCount: failureCount,
        isIdle: isIdle,
        isSuccess: isSuccess,
        variables: variables,
        status: status,
    } = trpc.auth.signInWithEmailAndPassword.useMutation();

    return {
        signInWithEmailAndPasswordAsync,
        signInWithEmailAndPassword,
        error,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status
    }
}

export const useRefreshAccessToken = () => {
    const {
        mutateAsync: refreshAccessTokenAsync,
        mutate: refreshAccessToken,
        error: error,
        isError: isError,
        failureCount: failureCount,
        isIdle: isIdle,
        isSuccess: isSuccess,
        variables: variables,
        status: status,
    } = trpc.auth.refreshAccessToken.useMutation();

    return {
        refreshAccessTokenAsync,
        refreshAccessToken,
        error,
        isError,
        failureCount,
        isIdle,
        isSuccess,
        variables,
        status
    }
}