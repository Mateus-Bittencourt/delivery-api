import express from "express";
import { promises as fs } from "fs";
import cors from "cors";
import ordersRouter from "./routes/orders.routes.js";

const { readFile, writeFile } = fs;

global.fileName = "pedidos.json";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/pedidos", ordersRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    console.log("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      pedidos: [],
    };
    writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => {
        console.log("API Started and file created!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
