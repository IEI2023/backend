import * as fs from "fs";

class JSONtoJSON {
  private inputfilePath: string;
  private outputFilePath: string;

  constructor(inputFilePath: string, outputFilePath: string) {
    this.inputfilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
  }

  private mapData(data: any[]): any[] {
    const mappedData = data.map((row) => ({
      CODIGO: row.codcen,
      CE_nombre: row.dencen,
      CE_tipo:
        row.titularidad === "P"
          ? "Público"
          : "C"
          ? "Concertado"
          : "N"
          ? "Privado"
          : "",
      CE_direccion: row.domcen,
      CE_codigo_postal: row.cpcen,
      CE_longitud: row["geo-referencia"] ? row["geo-referencia"].lon : null,
      CE_latitud: row["geo-referencia"] ? row["geo-referencia"].lat : null,
      CE_telefono: row.telcen,
      CE_descripcion: row.presentacionCorta,
      L_codigo: -1,
      L_nombre: row.loccen,
      P_codigo: 30,
      P_nombre: "Murcia",
    }));

    // Filtrar registros duplicados basados en el campo CODIGO
    const uniqueData = [];
    const seenCodes = new Set();
    const localidades = [];

    for (const item of mappedData) {
      if (
        !item.CODIGO ||
        !item.CE_nombre ||
        !item.CE_tipo ||
        !item.CE_direccion ||
        !item.CE_codigo_postal ||
        item.CE_codigo_postal.length !== 5 ||
        !item.CE_longitud ||
        !item.CE_latitud ||
        !item.CE_telefono ||
        item.CE_telefono.length !== 9 ||
        !item.CE_descripcion ||
        !item.L_nombre ||
        !item.P_codigo ||
        !item.P_nombre
      ) {
        console.warn("Registro con campos faltantes, omitiendo:", item);
        continue;
      }

      let codigoLocalidadIndex = localidades.findIndex(
        (loc) => loc.L_nombre === item.L_nombre
      );
      let codigoLocalidad = codigoLocalidadIndex;

      if (codigoLocalidadIndex === -1) {
        codigoLocalidad = localidades.push({ L_nombre: item.L_nombre }) - 1;
      }
      item.L_codigo = codigoLocalidad;

      if (!seenCodes.has(item.CODIGO)) {
        seenCodes.add(item.CODIGO);
        uniqueData.push(item);
      } else {
        console.warn("Registro duplicado, omitiendo:", item);
      }
    }

    const uniqueDataWithoutCode = uniqueData.map(({ CODIGO, ...rest }) => rest);
    return uniqueDataWithoutCode;
  }

  public convertAndSaveJSON(): void {
    try {
      const data = JSON.parse(fs.readFileSync(this.inputfilePath, "utf8"));
      const mappedData = this.mapData(data);
      fs.writeFileSync(
        this.outputFilePath,
        JSON.stringify(mappedData, null, 2)
      );
      console.log(`JSON file saved at: ${this.outputFilePath}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

const inputFilePath = "../data/centros.json";
const outputFilePath = "../data/MURCIA-ADAPTADO.json";
const converter = new JSONtoJSON(inputFilePath, outputFilePath);
converter.convertAndSaveJSON();
