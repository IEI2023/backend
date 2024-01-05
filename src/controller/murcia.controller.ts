import { Request, Response } from "express";
import { AppDataSource as dataSource } from "../data-source";
import * as dotenv from "dotenv";
import MurMapper from "../mappers/MurMapper";
import { CentroEducativo } from "../entity/CentroEducativo";
import { Localidad } from "../entity/Localidad";
import { Provincia } from "../entity/Provincia";
import axios, { all } from "axios";
dotenv.config();

const centroEducativoRepository = dataSource.getRepository(CentroEducativo);
const localidadRepository = dataSource.getRepository(Localidad);
const provinciaRepository = dataSource.getRepository(Provincia);

export const getAll = async (req: Request, res: Response) => {
  try {
    const url = process.env.WRAPPER_URL + ":3001" + "/jsonFromFile";
    const data = await axios.get(url);

    const jsonData = data.data;

    const murMapper = new MurMapper().mapData(jsonData);

    let successCount = 0;
    let errorCount = 0;
    const errorCentros: any[] = [];

    for (const centro of murMapper.data) {
      try {
        // Comprobar si exite la provincia en la base de datos
        let provincia = await provinciaRepository.findOne({
          where: { nombre: centro.P_nombre },
        });

        if (!provincia) {
          // Si no existe se crea
          const newProvincia = new Provincia();
          newProvincia.nombre = centro.P_nombre;
          newProvincia.codigo = centro.P_codigo;
          provincia = await provinciaRepository.save(newProvincia);
        }

        // Comprobar si exite la localidad en la base de datos
        let localidad = await localidadRepository.findOne({
          where: { nombre: centro.L_nombre },
        });

        if (!localidad) {
          // Si no existe se crea
          const newLocalidad = new Localidad();
          newLocalidad.nombre = centro.L_nombre;
          newLocalidad.codigo = centro.L_codigo;
          newLocalidad.provincia = provincia;
          localidad = await localidadRepository.save(newLocalidad);
        }

        // Comprobar si exite el centro en la base de datos
        const centroEducativo = await centroEducativoRepository.findOne({
          where: {
            nombre: centro.CE_nombre,
            tipo: centro.CE_tipo,
            codigoPostal: centro.CE_codigo_postal,
          },
        });

        if (!centroEducativo) {
          // Si no existe se crea
          const centroEducativo = new CentroEducativo();
          centroEducativo.nombre = centro.CE_nombre;
          centroEducativo.direccion = centro.CE_direccion;
          centroEducativo.codigoPostal = centro.CE_codigo_postal;
          centroEducativo.longitud = centro.CE_longitud;
          centroEducativo.latitud = centro.CE_latitud;
          centroEducativo.telefono = centro.CE_telefono;
          centroEducativo.descripcion = centro.CE_descripcion;
          centroEducativo.tipo = centro.CE_tipo;
          centroEducativo.localidad = localidad;
          await centroEducativoRepository.save(centroEducativo);

          successCount++;
        } else {
          errorCount++;
          errorCentros.push(
            "Centro educativo existente en la base de datos: " +
              centro.CE_nombre
          );
        }
      } catch (error) {
        errorCount++;
        errorCentros.push(centro);
        console.log(error);
      }
    }

    // Incluir errores generales en la respuesta
    const allErrors = [...murMapper.errors, ...errorCentros];

    const response = {
      successCount,
      errorCount: allErrors.length,
      errors: allErrors,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const add = async (req: Request, res: Response) => {
  const url = process.env.WRAPPER_URL + ":3001" + "/jsonFromBody";

  try {
    const data = await axios.post(url, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = data.data;

    const murMapper = new MurMapper().mapData(jsonData);

    let successCount = 0;
    let errorCount = 0;
    const errorCentros: any[] = [];

    for (const centro of murMapper.data) {
      try {
        // Comprobar si exite la provincia en la base de datos
        let provincia = await provinciaRepository.findOne({
          where: { nombre: centro.P_nombre },
        });

        if (!provincia) {
          // Si no existe se crea
          const newProvincia = new Provincia();
          newProvincia.nombre = centro.P_nombre;
          newProvincia.codigo = centro.P_codigo;
          provincia = await provinciaRepository.save(newProvincia);
        }

        // Comprobar si exite la localidad en la base de datos
        let localidad = await localidadRepository.findOne({
          where: { nombre: centro.L_nombre },
        });

        if (!localidad) {
          // Si no existe se crea
          const newLocalidad = new Localidad();
          newLocalidad.nombre = centro.L_nombre;
          newLocalidad.codigo = centro.L_codigo;
          newLocalidad.provincia = provincia;
          localidad = await localidadRepository.save(newLocalidad);
        }

        // Comprobar si exite el centro en la base de datos
        const centroEducativo = await centroEducativoRepository.findOne({
          where: {
            nombre: centro.CE_nombre,
            tipo: centro.CE_tipo,
            codigoPostal: centro.CE_codigo_postal,
          },
        });

        if (!centroEducativo) {
          // Si no existe se crea
          const centroEducativo = new CentroEducativo();
          centroEducativo.nombre = centro.CE_nombre;
          centroEducativo.direccion = centro.CE_direccion;
          centroEducativo.codigoPostal = centro.CE_codigo_postal;
          centroEducativo.longitud = centro.CE_longitud;
          centroEducativo.latitud = centro.CE_latitud;
          centroEducativo.telefono = centro.CE_telefono;
          centroEducativo.descripcion = centro.CE_descripcion;
          centroEducativo.tipo = centro.CE_tipo;
          centroEducativo.localidad = localidad;
          await centroEducativoRepository.save(centroEducativo);

          successCount++;
        } else {
          errorCentros.push(
            "Centro educativo existente en la base de datos: " +
              centro.CE_nombre
          );
        }
      } catch (error) {
        errorCentros.push(centro);
        console.log(error);
      }
    }

    // Incluir errores generales en la respuesta
    const allErrors = [...murMapper.errors, ...errorCentros];

    const response = {
      successCount,
      errorCount: allErrors.length,
      errors: allErrors,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
