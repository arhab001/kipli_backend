import express, { request, response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors"
import { createUsers, getAvailableUsers, updateDataUser } from "./repository.js";
const app = express();
app.use(express.json());
app.use(cors({
    origin : "*"
}))

dotenv.config();

secretkey = process.env.SECRET_KEY ?? "880088"

function handleJWT(request,response,next) {
    const auth = request.headers.auth
    if (!auth) {
        response.status(401).send("Unauthorized"); return;
    }
    try {
        const payload = jwt.verify(auth,secretkey);
        console.log(payload);
        request.useremail = payload.email;
        next();
    } catch (error) {
        console.error(error)
        response.status(401).send("Unauthorized"); return;
    }
}

app.post('/update',handleJWT,(request,response)=> {
    const data = request.body.data;
    if (!data) {
        response.status(400).send('bad request')
        return;
    }
    try {
        updateDataUser(request.useremail,data);
        response.status(200).send('ok')
    } catch (error) {
        console.log(error);
        response.status(500).send('internal server error')
    }
})

app.get('/',handleJWT,async (request,response)=>{
    const email = request.useremail;
    const data = await getAvailableUsers(email)
    response.json(data);
})

app.get("/test",(req,res)=>{
    res.json({message : "Berhasil"})
})

app.post('/auth', async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        response.status(400).send('bad request')
        return;
    }
    try {
        const status = await getAvailableUsers(email);
        console.log(status);
        if (status) {
            console.log("user ditemukan");
            if (password == status.password) {
                const token = jwt.sign({
                    email: status.email,
                    createAt: Date.now().toString()
                }, secretkey);
                response.json({ token }); return;
            } else {
        response.status(401).send("Unauthorized"); return;


            }
        } else {
            await createUsers(email, password);
            const token = jwt.sign({
                email: email,
                createAt: Date.now().toString()
            }, secretkey);
            response.json({ token }); return;

        }
    } catch (error) {
        console.error(error)
        response.status(500).send('internal server error')
    }
})


app.listen(3000,()=> {
    console.log("listening  :3000")
})
