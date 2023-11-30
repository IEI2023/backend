class CatMapper {
  public mapData(data: any[]): any {
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
        CE_nombre: row.denominaci_completa[0],
        CE_tipo: this.getTipo(row.nom_naturalesa[0]),
        CE_direccion: row.adre_a[0],
        CE_codigo_postal: row.codi_postal[0],
        CE_longitud: row.coordenades_geo_x[0],
        CE_latitud: row.coordenades_geo_y[0],
        // No tiene telefono
        CE_descripcion: row.denominaci_completa[0],
        L_codigo: row.codi_postal[0],
        L_nombre: row.nom_municipi[0],
        P_codigo: this.getCodigoProvincia(row.codi_postal[0]),
        P_nombre: this.getNombreProvincia(row.codi_postal[0]),
      };

      // Validaciones
      const validationErrors = this.validateMappedRow(
        mappedRow,
        row.denominaci_completa[0]
      );
      if (validationErrors.length === 0) {
        return mappedRow;
      } else {
        for (const error of validationErrors) {
          result.errors.push(error);
        }
        return null;
      }
    });

    // Filtrar registros duplicados basado en el nombre y codigo postal
    const seenCodes = new Set();

    for (const item of mappedData) {
      if (!item) {
        continue; // Skip null items (errored rows)
      }

      if (!seenCodes.has(item.CE_nombre + item.CE_codigo_postal)) {
        seenCodes.add(item.CE_nombre + item.CE_codigo_postal);
        result.data.push(item);
      } else {
        result.errors.push(`Registro duplicado, omitiendo: ${item.CE_nombre}`);
      }
    }
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

  private getTipo(tipo: string) {
    switch (tipo) {
      case "Públic":
        return "Público";
      case "Privat":
        return "Privado";
    }
  }

  private getCodigoProvincia(codigoPostal: string) {
    const provinciaCode = parseInt(codigoPostal.substring(0, 2), 10);
    return provinciaCode;
  }

  private getNombreProvincia(codigoPostal: string) {
    let codProv = this.getCodigoProvincia(codigoPostal);
    switch (codProv) {
      case 8:
        return "GERONA";
      case 17:
        return "TARRAGONA";
      case 25:
        return "BARCELONA";
      case 43:
        return "LÉRIDA";
    }
  }
}

export default CatMapper;
