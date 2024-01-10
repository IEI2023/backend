import { Request, Response } from "express";
import { AppDataSource as dataSource } from "../data-source";
import { CentroEducativo } from "../entity/CentroEducativo";
import { Localidad } from "../entity/Localidad";
import { Like } from "typeorm";

const centroEducativoRepository = dataSource.getRepository(CentroEducativo);
const localidadRepository = dataSource.getRepository(Localidad);

export const get = async (req: Request, res: Response) => {
  // Parsear el cuerpo JSON manualmente
  let body;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: "Invalid JSON" });
  }

  const { localidad, cp, provincia, tipo } = body;

  if (!localidad && !cp && !provincia && !tipo) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const centros = await centroEducativoRepository.find({
    where: {
      codigoPostal: cp,
      tipo: tipo,
    },
    relations: { localidad: true },
  });

  if (!centros.length) {
    return res.status(404).json({});
  }

  if (localidad) {
    const centrosLocalidadFiltered = centros.filter((centro) =>
      centro.localidad.nombre.includes(localidad)
    );

    if (!centrosLocalidadFiltered.length) {
      return res.status(404).json({});
    }

    if (provincia) {
      const filteredCentros = [];

      for (let centro of centrosLocalidadFiltered) {
        const provinciaObject = await localidadRepository.find({
          where: { nombre: Like(centro.localidad.nombre) },
          relations: ["provincia"],
        });

        // Si se encuentra la provincia y coincide con la proporcionada
        if (
          provinciaObject.length > 0 &&
          provinciaObject[0].provincia.nombre.includes(provincia)
        ) {
          filteredCentros.push(centro);
        }
      }

      return res.status(200).json(filteredCentros);
    }
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
