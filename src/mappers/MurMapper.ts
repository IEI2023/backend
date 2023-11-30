class MurMapper {
  public mapData(data: any[]) {
    const result = {
      data: [],
      errors: [],
    };

    this.filterDataFormat(data, result);

    return result;
  }

  private filterDataFormat(
    data: any[],
    result: { data: any[]; errors: any[] }
  ) {
    const mappedData = data.map((row) => {
      const mappedRow = {
        CODIGO: row.codcen,
        CE_nombre: row.dencen,
        CE_tipo:
          row.titularidad === "P"
            ? "Público"
            : row.titularidad === "C"
            ? "Concertado"
            : row.titularidad === "N"
            ? "Privado"
            : "",
        CE_direccion: row.domcen,
        CE_codigo_postal: row.cpcen,
        CE_longitud: row["geo-referencia"] ? row["geo-referencia"].lon : null,
        CE_latitud: row["geo-referencia"] ? row["geo-referencia"].lat : null,
        CE_telefono: row.telcen,
        CE_descripcion: row.presentacionCorta,
        L_codigo: row.cpcen,
        L_nombre: row.loccen,
        P_codigo: 30,
        P_nombre: "Murcia",
      };

      // Validaciones
      const validationErrors = this.validateMappedRow(mappedRow, row.dencen);
      if (validationErrors.length === 0) {
        return mappedRow;
      } else {
        for (const error of validationErrors) {
          result.errors.push(error);
        }
        return null;
      }
    });

    // Filtrar registros duplicados basados en el campo CODIGO
    const uniqueData = [];
    const seenCodes = new Set();
    const localidades = [];

    for (const item of mappedData) {
      if (!item) {
        continue; // Skip null items (errored rows)
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
        result.data.push(item);
      } else {
        result.errors.push(`Registro duplicado, omitiendo: ${item.CE_nombre}`);
      }
    }
  }

  private validateMappedRow(row: any, centroNombre: string): string[] {
    const errors = [];

    if (!row.CODIGO) errors.push(`Falta el campo CODIGO en ${centroNombre}`);
    if (!row.CE_nombre)
      errors.push(`Falta el campo CE_nombre en ${centroNombre}`);
    if (!row.CE_tipo) errors.push(`Falta el campo CE_tipo en ${centroNombre}`);
    if (!row.CE_direccion)
      errors.push(`Falta el campo CE_direccion en ${centroNombre}`);
    if (!row.CE_codigo_postal || row.CE_codigo_postal.length !== 5)
      errors.push(`El campo CE_codigo_postal es inválido en ${centroNombre}.`);
    if (!row.CE_longitud)
      errors.push(`Falta el campo CE_longitud en ${centroNombre}.`);
    if (!row.CE_latitud)
      errors.push(`Falta el campo CE_latitud en ${centroNombre}.`);
    if (!row.L_nombre)
      errors.push(`Falta el campo L_nombre en ${centroNombre}.`);
    if (!row.P_codigo)
      errors.push(`Falta el campo P_codigo en ${centroNombre}.`);
    if (!row.P_nombre)
      errors.push(`Falta el campo P_nombre en ${centroNombre}.`);

    return errors;
  }
}

export default MurMapper;
