class Mapper {
  
  private constructor(){}

  public mapData(data:JSON){}

  //PENDIENTE DE CAMBIAR
  private filterDataFormat(data: any[]){
    return data.map((row) => ({
      CE_nombre: row.DENOMINACION,
      CE_tipo: this.getTipo(row.REGIMEN),
      CE_direccion: `${row.TIPO_VIA} ${row.DIRECCION} ${row.NUMERO}`,
      CE_codigo_postal: row.CODIGO_POSTAL,
      //CE_longitud: this.getLongitud(row.TIPO_VIA, row.DIRECCION, row.NUMERO),
      //CE_latitud: this.getLatitud(row.TIPO_VIA, row.DIRECCION, row.NUMERO),
      CE_telefono: row.TELEFONO,
      CE_descripcion: row.DESCRIPCION,
      L_codigo: row.CODIGO_POSTAL,
      L_nombre: row.LOCALIDAD,
      //P_codigo: this.getProvinceCode(row.CODIGO_POSTAL),
      //P_nombre: this.getProvinceName(row.PROVINCIA),
    }));


  }//filterDataFormat

  private filterDuplicates(data: any[]) {
  
  
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

  private NombreProvincia(codigoPostal:string){
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
