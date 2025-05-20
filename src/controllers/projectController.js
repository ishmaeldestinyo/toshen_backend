import {
    createProjectService,
    listProjectService,
    retrieveProjectService,
    deleteProjectService,
    updateProjectService,

    createCategoryService,
    listCategoryService,
    retrieveCategoryService,
    deleteCategoryService,
    updateCategoryService,
} from '../services/projectService.js'


export const createProjectController = async (req, res, next) => {
    return await createProjectService(req, res, next)
}
export const listProjectController = async (req, res, next) => {
    return await listProjectService(req, res, next)
}
export const retrieveProjectController = async (req, res, next) => {
    return await retrieveProjectService(req, res, next)
}
export const deleteProjectController = async (req, res, next) => {
    return await deleteProjectService(req, res, next)
}
export const updateProjectController = async (req, res, next) => {
    return await updateProjectService(req, res, next)
}

// Category Controller

export const createCategoryController = async (req, res, next) => {
    return await createCategoryService(req, res, next)
}
export const listCategoryController = async (req, res, next) => {
    return await listCategoryService(req, res, next)
}
export const retrieveCategoryController = async (req, res, next) => {
    return await retrieveCategoryService(req, res, next)
}
export const deleteCategoryController = async (req, res, next) => {
    return await deleteCategoryService(req, res, next)
}
export const updateCategoryController = async (req, res, next) => {
    return await updateCategoryService(req, res, next)
}