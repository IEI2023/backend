import { Request, Response } from "express";
import { AppDataSource as dataSource } from "../data-source";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

export const getAll = async (req: Request, res: Response) => {
  try {
    const url = process.env.MURCIA_URL + "/jsonFromFile";
    const data = await fetch(url);
    const json = await data.json();

    // Filtrar y meter en la base de datos

    // Devolver los que han fallado y cuantos se han hecho correctamente
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    if (!postData) {
      throw new Error("No se han recibido datos");
    }

    const url = process.env.MURCIA_URL + "/jsonFromBody";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const json = await response.json();

    // Filtrar y meter en la base de datos

    // Devolver los que han fallado y cuantos se han hecho correctamente
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
