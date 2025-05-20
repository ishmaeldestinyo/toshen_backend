import {
    confirmVerificationCredentialsService,
    getMyProfileService,
    loginService,
    resetPasswordSubmitService,
    signUpService,
    sendVerificationCredentialsService,
    updateMyProfileService,
} from '../services/userService.js';

export const signUpController = async (req, res, next) => {
    // sign up user
    return await signUpService(req, res, next);
}

export const loginController = async (req, res, next) => {
    // login user
    return await loginService(req, res, next);

}

export const getMyProfileController = async (req, res, next) => {
    return await getMyProfileService(req, res, next);
    
}

export const updateMyProfileController = async (req, res, next) => {
    return await updateMyProfileService(req, res, next);
}

export const sendVerificationCredentialsController = async (req, res, next) => {
    return await sendVerificationCredentialsService(req, res, next);
}

export const confirmVerificationCredentialsController = async (req, res, next) => {
    return await confirmVerificationCredentialsService(req, res, next);
}

export const resetPasswordSubmitController = async (req, res, next) => {
    return await resetPasswordSubmitService(req, res, next);
}