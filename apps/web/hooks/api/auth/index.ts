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

export const useForgotPasswordRequest = () => {
    const {
        mutateAsync: forgotPasswordRequestAsync,
        mutate: forgotPasswordRequest,
        error, isError, failureCount, isIdle, isSuccess, variables, status,
    } = trpc.auth.forgotPasswordRequest.useMutation();

    return { forgotPasswordRequestAsync, forgotPasswordRequest, error, isError, failureCount, isIdle, isSuccess, variables, status };
}

export const useForgotPasswordVerify = () => {
    const {
        mutateAsync: forgotPasswordVerifyAsync,
        mutate: forgotPasswordVerify,
        error, isError, failureCount, isIdle, isSuccess, variables, status,
    } = trpc.auth.forgotPasswordVerify.useMutation();

    return { forgotPasswordVerifyAsync, forgotPasswordVerify, error, isError, failureCount, isIdle, isSuccess, variables, status };
}

export const useResetPassword = () => {
    const {
        mutateAsync: resetPasswordAsync,
        mutate: resetPassword,
        error, isError, failureCount, isIdle, isSuccess, variables, status,
    } = trpc.auth.resetPassword.useMutation();

    return { resetPasswordAsync, resetPassword, error, isError, failureCount, isIdle, isSuccess, variables, status };
}