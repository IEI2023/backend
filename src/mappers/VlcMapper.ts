import { getCoordinates } from "../selenium/main";

class VlcMapper {
  public async mapData(data: any[]) {
    const result = {
      data: [],
      errors: [],
    };

    await this.filterDataFormat(data, result);

    return result;
  }

  private async filterDataFormat(
    data: any[],
    result: { data: any[]; errors: any[] }
  ) {
    let mappedData = [];
    for (const row of data) {
      let coordinatesPromise = null;
      (async () => {
        coordinatesPromise = getCoordinates(
          `${row.TIPO_VIA} ${row.DIRECCION} ${row.NUMERO}`
        );
      })();

      const coordinates = await coordinatesPromise;

      if (!coordinates) {
        result.errors.push(
          `No se ha podido encontrar las coordenadas para ${row.DENOMINACION}`
        );
        continue;
      }

      const mappedRow = {
        CE_nombre: row.DENOMINACION,
        CE_tipo: this.getTipo(row.REGIMEN),
        CE_direccion: `${row.TIPO_VIA} ${row.DIRECCION} ${row.NUMERO}`,
        CE_codigo_postal: this.checkCP(row.CODIGO_POSTAL),
        CE_longitud: coordinates.lon,
        CE_latitud: coordinates.lat,
        CE_telefono: row.TELEFONO,
        CE_descripcion: row.DESCRIPCION,
        L_codigo: row.CODIGO_POSTAL,
        L_nombre: row.LOCALIDAD,
        P_codigo: this.getProvinceCode(row.CODIGO_POSTAL),
        P_nombre: this.getProvinceName(row.PROVINCIA),
      };

      // Validaciones
      const validationErrors = this.validateMappedRow(
        mappedRow,
        row.DENOMINACION
      );
      if (validationErrors.length === 0) {
        return mappedData.push(mappedRow);
      } else {
        for (const error of validationErrors) {
          result.errors.push(error);
        }
        continue;
      }
    }

    // Filtrar registros duplicados basados en el el nombre y codigo postal
    const uniqueData = [];
    const seenCodes = new Set();

    for (const item of mappedData) {
      if (!item) {
        continue; // Skip null items (errored rows)
      }

      const key = `${(await item).CE_nombre}-${(await item).CE_codigo_postal}`;

      if (!seenCodes.has(key)) {
        seenCodes.add(key);
        result.data.push(item);
      } else {
        result.errors.push(
          `Registro duplicado, omitiendo: ${(await item).CE_nombre}`
        );
      }
    }
  }

  checkCP(CODIGO_POSTAL: any) {
    if (CODIGO_POSTAL.length < 5) {
      const cerosFaltantes = 5 - CODIGO_POSTAL.length;
      CODIGO_POSTAL = "0".repeat(cerosFaltantes) + CODIGO_POSTAL;
    }
    return CODIGO_POSTAL;
  }

  private validateMappedRow(row: any, centroNombre: string): string[] {
    const errors = [];

    if (!row.CE_nombre)
      errors.push(`Falta el campo CE_nombre en ${centroNombre}`);
    if (!row.CE_tipo) errors.push(`Falta el campo CE_tipo en ${centroNombre}`);
    if (!row.CE_direccion)
      errors.push(`Falta el campo CE_direccion en ${centroNombre}`);
    if (!row.CE_codigo_postal || row.CE_codigo_postal.length !== 5)
      errors.push(`El campo CE_codigo_postal es inválido en ${centroNombre}.`);
    if (row.CE_longitud === null || row.CE_longitud === undefined)
      errors.push(`Falta el campo CE_longitud en ${centroNombre}.`);
    if (row.CE_latitud === null || row.CE_latitud === undefined)
      errors.push(`Falta el campo CE_latitud en ${centroNombre}.`);
    if (!row.L_nombre)
      errors.push(`Falta el campo L_nombre en ${centroNombre}.`);
    if (!row.P_codigo)
      errors.push(`Falta el campo P_codigo en ${centroNombre}.`);
    if (!row.P_nombre)
      errors.push(`Falta el campo P_nombre en ${centroNombre}.`);

    return errors;
  }

  private getTipo(tipo: string): string {
    switch (tipo) {
      case "PÚB.":
        return "Público";
      case "PRIV. CONC.":
        return "Concertado";
      case "PRIV.":
        return "Privado";
      case "OTROS":
        return "Otros";
    }
  }

  private getProvinceCode(codigo_postal: string): number {
    if (codigo_postal.length < 5) {
      const cerosFaltantes = 5 - codigo_postal.length;
      codigo_postal = "0".repeat(cerosFaltantes) + codigo_postal;
    }

    const provinciaCode = parseInt(codigo_postal.substring(0, 2), 10);
    return provinciaCode;
  }

  private getProvinceName(name: string): string {
    switch (name) {
      case "ALICANTE/ALACANT":
        return "Alicante";
      case "CASTELLÓN/CASTELLÓ":
        return "Castellón";
      case "VALENCIA/VALÈNCIA":
        return "Valencia";
    }
  }
}

export default VlcMapper;
