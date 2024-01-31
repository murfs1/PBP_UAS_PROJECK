import {prismaClient} from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}

export const removeAllTestPerpustakaan = async () => {
    await prismaClient.perpus.deleteMany({
        where: {
            username: 'test'
        }
    });
}

export const createTestPerpus = async () => {
    await prismaClient.perpus.create({
        data: {
            username: "test",
            title: "test",
            author: "test",
            publication_year: "test",
            genre: "test"
        }
    })
}

export const createManyTestPerpustakaan = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.perpus.create({
            data: {
                username: `test`,
                title: `test${i}`,
                author: `test${i}`,
                publication_year: `test${i}`,
                genre: `test${i}`
            }
        })
    }
}

export const getTestPerpus = async () => {
    return prismaClient.perpus.findFirst({
        where: {
            username: 'test'
        }
    })
}