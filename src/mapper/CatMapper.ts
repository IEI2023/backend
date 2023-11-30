import { get } from "http";

class CatMapper {
  private constructor() {}

  public mapData(data: JSON) {}

  private filterDataFormat(data: any[]) {
    return data.map((row) => ({
      CE_nombre: row.denominaci_completa,
      CE_tipo: this.getTipo(row.nom_naturalesa),
      CE_direccion: row.adre_a,
      CE_codigo_postal: row.codi_postal,
      CE_longitud: row.coordenades_geo_x, // creo que dijo que usáramos geo
      CE_latitud: row.coordenades_geo_y,
      CE_telefono: 123456789, // no está en el dataset
      CE_descripcion: row.denominaci_completa,
      L_codigo: row.codi_municipi_6_digits,
      L_nombre: row.nom_municipi,
      P_codigo: this.getProvinceCode(row.codi_postal),
      P_nombre: this.getProvinceName(row.codi_postal),
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
      case "Públic":
        return "Público";
      case "Privat":
        return "Privado";
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

  private getProvinceCode(codi_postal: string): number {
    if (codi_postal.length < 5) {
      const cerosFaltantes = 5 - codi_postal.length;
      codi_postal = "0".repeat(cerosFaltantes) + codi_postal;
    }

    const provinciaCode = parseInt(codi_postal.substring(0, 2), 10);
    return provinciaCode;
  }

  private getProvinceName(codi_postal: string): string {
    const codigo_provincia = this.getProvinceCode(codi_postal);

    switch (codigo_provincia) {
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
