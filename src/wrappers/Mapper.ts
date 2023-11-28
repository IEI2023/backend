class Mapper {
  
  private constructor(){}

  public mapData(data:JSON){}

  //PENDIENTE DE CAMBIAR
  private filterDataFormat(data: any[]){
    //rowNested solo será 0
    return data.map(rowNested => rowNested.map((row) => ({
          CE_nombre: row.denominaci_completa[0],
          CE_tipo: this.getTipo(row.nom_naturalesa[0]),
          CE_direccion: row.adre_a[0],
          CE_codigo_postal: row.CODIGO_POSTAL,
          CE_longitud: row.coordenades_geo_x[0],
          CE_latitud: row.coordenades_geo_y[0],
          CE_descripcion: row.denominaci_completa[0],

          //Cambiar por código generado por la DB
          L_codigo: row.codi_postal[0],
          
          L_nombre: row.nom_municipi[0],
          P_codigo: this.getCodigoProvincia(row.CODIGO_POSTAL[0]),
          P_nombre: this.getNombreProvincia(row.PROVINCIA[0]),
          }
        ) 
      )
    );
  }//filterDataFormat

  private filterDuplicates(data: any[]) {
    const uniqueData = [];

    for (const item of data) {
      if (
        !item.CE_nombre ||
        !item.CE_tipo ||
        !item.CE_direccion ||
        !item.CE_codigo_postal ||
        !item.CE_longitud ||
        !item.CE_latitud ||
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
  
  }//filterDuplicates

  
  private getTipo(tipo:string){
    switch (tipo) {
      case "Públic.":
        return "Público";
      case "Privat.":
        return "Privado";
    }
  }

  private getCodigoProvincia(codigoPostal:string){
    const provinciaCode = parseInt(codigoPostal.substring(0, 2), 10);
    return provinciaCode;
  }

  private getNombreProvincia(codigoPostal:string){
    let codProv = this.getCodigoProvincia(codigoPostal)
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

}//Mapper
