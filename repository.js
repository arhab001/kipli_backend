import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();


export async function getAvailableUsers(email) {
    const data = await prisma.user.findFirst({where : { email : email}});
    return data
}

export async function updateDataUser(email,newData) {
     const datauser = await prisma.user.findFirst({where : {email : email}});
     const oldData = datauser.data || []
     oldData.push(newData); // tambah new data
     await prisma.user.update({
        where : {
            email : email
        },
        data : {
            data : oldData
        }
     });
}

export async function createUsers(email , password) {
    await prisma.user.create({
        data : {email,password}
    })
}