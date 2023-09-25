import express, { Request, Response, NextFunction } from "express";
import path from "path";
import expressSession from "express-session";
import fs from "fs";

const uploadDir = 'uploads'
fs.mkdirSync(uploadDir, { recursive: true })

const app = express();

app.use(
    expressSession({
        secret: "I failed Typescript",
        resave: true,
        saveUninitialized: true,
    })
);

// interface MySessionData {
//     counter?: number;
// }

declare module "express-session" {
    interface SessionData {
        counter?: number;
    }
}

// async function writeFile {

// }

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.post("/contact", (req: Request, res: Response) => {
    const texts = req.body;
    fs.writeFileSync('memos.json', JSON.stringify(texts))
    console.log(req.body)
    res.redirect("/")

})
  

app.use((req: Request, _res: Response, next: NextFunction) => {
    if (!req.session.counter) {
        req.session.counter = 0;
    }
    req.session.counter++;
    console.log(`Count`, req.session.counter);
    console.log(`[${new Date().toLocaleString()}] Request ${req.path}`);
    next();

});

app.use(express.static("public"));

app.use((_req, res) => {
    res.sendFile(path.resolve("./public/404.html"));
})

const PORT = 8080;

app.listen(8080, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});