import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getAvailableUsers(email) {
    return prisma.user.findFirst({ where: { email } });
}

export async function updateDataUser(email, newData) {
    const datauser = await prisma.user.findFirst({ where: { email } });
    const oldData = datauser?.data || [];
    oldData.push(newData);
    await prisma.user.update({
        where: { email },
        data: { data: oldData },
    });
}

export async function deleteHistory(email) {
    return await prisma.user.update({
        where: { email },
        data: {
            data: null
        }
    }
    )
}

export async function createUsers(email, password) {
    const hash_password = await bcrypt.hash(password, 3);
    await prisma.user.create({
        data: { email, password: hash_password },
    });
}
