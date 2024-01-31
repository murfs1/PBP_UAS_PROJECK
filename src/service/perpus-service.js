import {validate} from "../validation/validation.js";
import {
    createPerpusValidation,
    getPerpusValidation, searchPerpusValidation,
    updatePerpusValidation
} from "../validation/perpus-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const perpus = validate(createPerpusValidation, request);
    perpus.username = user.username;

    return prismaClient.perpus.create({
        data: perpus,
        select: {
            id: true,
            title: true,
            author: true,
            publication_year: true,
            genre: true
        }
    });
}

const get = async (user, perpusId) => {
    perpusId = validate(getPerpusValidation, perpusId);

    const perpus = await prismaClient.perpus.findFirst({
        where: {
            username: user.username,
            id: perpusId
        },
        select: {
            id: true,
            title: true,
            author: true,
            publication_year: true,
            genre: true
        }
    });

    if (!perpus) {
        throw new ResponseError(404, "perpus is not found");
    }

    return perpus;
}

const update = async (user, request) => {
    const perpus = validate(updatePerpusValidation, request);

    const totalPerpusInDatabase = await prismaClient.perpus.count({
        where: {
            username: user.username,
            id: perpus.id
        }
    });

    if (totalPerpusInDatabase !== 1) {
        throw new ResponseError(404, "Perpus is not found");
    }

    return prismaClient.perpus.update({
        where: {
            id: perpus.id
        },
        data: {
            title: perpus.title,
            author: perpus.author,
            publication_year: perpus.publication_year,
            genre: perpus.genre,
        },
        select: {
            id: true,
            title: true,
            author: true,
            publication_year: true,
            genre: true
        }
    })
}

const remove = async (user, perpusId) => {
    perpusId = validate(getPerpusValidation, perpusId);

    const totalInDatabase = await prismaClient.perpus.count({
        where: {
            username: user.username,
            id: perpusId
        }
    });

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "perpus is not found");
    }

    return prismaClient.perpus.delete({
        where: {
            id: perpusId
        }
    });
}

const search = async (user, request) => {
    request = validate(searchPerpusValidation, request);

    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size;

    const filters = [];

    filters.push({
        username: user.username
    })

    if (request.title) {
        filters.push({
            title: {
                contains: request.title
            }
        });
    }
    if (request.author) {
        filters.push({
            author: {
                contains: request.author
            }
        });
    }
    if (request.publication_year) {
        filters.push({
            publication_year: {
                contains: request.publication_year
            }
        });
    }
    if (request.genre) {
        filters.push({
            genre: {
                contains: request.genre
            }
        });
    }

    const perpustakaan = await prismaClient.perpus.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItems = await prismaClient.perpus.count({
        where: {
            AND: filters
        }
    });

    return {
        data: perpustakaan,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}
