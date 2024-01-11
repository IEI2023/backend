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

  const centros = await centroEducativoRepository.find({
    where: { tipo: tipo },
    relations: { localidad: true },
  });

  let filteredCentros = centros;
  // Filter centros with same CP
  if (cp) {
    filteredCentros = filteredCentros.filter((centro) => {
      return centro.codigoPostal === cp;
    });
  }

  // Filter centros with same localidad
  if (localidad) {
    filteredCentros = filteredCentros.filter((centro) => {
      return centro.localidad.nombre.includes(localidad.toLowerCase());
    });
  }

  // Filter centros with same provincia
  if (provincia) {
    const centrosWithProvince = [];
    for (let centro of filteredCentros) {
      let localidad = await localidadRepository.find({
        where: { nombre: Like(centro.localidad.nombre) },
        relations: { provincia: true },
      });

      if (localidad[0].provincia.nombre.includes(provincia.toLowerCase()))
        centrosWithProvince.push({
          nombre: centro.nombre,
          direccion: centro.direccion,
          codigoPostal: centro.codigoPostal,
          longitud: centro.longitud,
          latitud: centro.latitud,
          telefono: centro.telefono,
          descripcion: centro.descripcion,
          tipo: centro.tipo,
          localidad: centro.localidad.nombre,
          provincia: localidad[0].provincia.nombre,
        });
    }
    return res.status(200).json(centrosWithProvince);
  } else {
    const formattedCentros = [];

    for (let centro of filteredCentros) {
      const localidad = await localidadRepository.find({
        where: { nombre: Like(centro.localidad.nombre) },
        relations: { provincia: true },
      });

      formattedCentros.push({
        nombre: centro.nombre,
        direccion: centro.direccion,
        codigoPostal: centro.codigoPostal,
        longitud: centro.longitud,
        latitud: centro.latitud,
        telefono: centro.telefono,
        descripcion: centro.descripcion,
        tipo: centro.tipo,
        localidad: centro.localidad.nombre,
        provincia: localidad[0].provincia.nombre,
      });
    }

    return res.status(200).json(formattedCentros);
  }
};

export const getAll = async (req: Request, res: Response) => {
  const centros = await centroEducativoRepository.find({
    relations: ["localidad"],
  });

  const formattedCentros = [];

  for (let centro of centros) {
    const localidad = await localidadRepository.find({
      where: { nombre: Like(centro.localidad.nombre) },
      relations: { provincia: true },
    });

    formattedCentros.push({
      nombre: centro.nombre,
      tipo: centro.tipo,
      direccion: centro.direccion,
      codigoPostal: centro.codigoPostal,
      longitud: centro.longitud,
      latitud: centro.latitud,
      localidad: localidad[0].nombre,
      provincia: localidad[0].provincia.nombre,
    });
  }

  return res.status(200).json(formattedCentros);
};
