class VlcMapper {
  private constructor() {}

  public mapData(data: JSON) {}

  private filterDataFormat(data: any[]) {
    return data.map((row) => ({
      CE_nombre: row.DENOMINACION,
      CE_tipo: this.getTipo(row.REGIMEN),
      CE_direccion: `${row.TIPO_VIA} ${row.DIRECCION} ${row.NUMERO}`,
      CE_codigo_postal: row.CODIGO_POSTAL,
      CE_longitud: this.getLongitud(row.TIPO_VIA, row.DIRECCION, row.NUMERO),
      CE_latitud: this.getLatitud(row.TIPO_VIA, row.DIRECCION, row.NUMERO),
      CE_telefono: row.TELEFONO,
      CE_descripcion: row.DESCRIPCION,
      L_codigo: row.CODIGO_POSTAL,
      L_nombre: row.LOCALIDAD,
      P_codigo: this.getProvinceCode(row.CODIGO_POSTAL),
      P_nombre: this.getProvinceName(row.PROVINCIA),
    }));
  }

  private filterDuplicates(data: any[]) {
    const uniqueData = [];

    for (const item of data) {
      if (
        !item.CE_nombre ||
        !item.CE_tipo ||
        !item.CE_direccion ||
        !item.CE_codigo_postal ||
        item.CE_codigo_postal.length !== 5 ||
        !item.CE_longitud ||
        !item.CE_latitud ||
        item.CE_telefono.length !== 9 ||
        !item.L_nombre ||
        !item.P_codigo ||
        !item.P_nombre
      ) {
        console.warn("Registro con campos faltantes, omitiendo:", item);
        continue;
      }
    }

    const uniqueDataWithoutCode = uniqueData.map(({ CODIGO, ...rest }) => rest);
    return uniqueDataWithoutCode;
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

  private getLongitud(
    tipo_via: string,
    direccion: string,
    numero: number
  ): string {
    return "";
  }

  private getLatitud(
    tipo_via: string,
    direccion: string,
    numero: number
  ): string {
    return "";
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
