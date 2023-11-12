class Mapper {
  public static transformarComunidadValenciana(centro: CentroEducativo): any {
    const resultado: any = {};

    resultado.denominacion = centro.nombre;
    resultado.CODIGO_POSTAL = centro.codigo_postal;

    // Transformar tipo
    switch (centro.tipo) {
      case "Público":
        resultado.tipo = "PÚB.";
        break;
      case "Concertado":
        resultado.tipo = "PRIV. CONC.";
        break;
      case "Privados":
        resultado.tipo = "PRIV.";
        break;
      default:
        resultado.tipo = "OTROS";
        break;
    }

    // Concatenar dirección
    resultado.DIRECCION = `${centro.direccion} ${centro.numero}`;

    // Extraer coordenadas
    resultado.COORDENADAS = Mapper.obtenerCoordenadas(
      centro.longitud,
      centro.latitud
    );

    return resultado;
  }

  private static obtenerCoordenadas(longitud: string, latitud: string): string {
    return `${longitud},${latitud}`;
  }
}
