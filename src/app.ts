import express, { Application, Request, Response } from "express"
import cors from 'cors';


const app: Application =express();

app.use(express.json());
app.use(cors());
// app.use("/notes", notesRouter);
// app.use("/users", usersRouter);

app.get("/",async (req: Request , res: Response)=>{
    res.json({message: "You have got me😁"})
})

export default app

