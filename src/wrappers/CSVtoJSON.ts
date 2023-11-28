import * as fs from "fs";
import { csvToJson } from "convert-csv-to-json";

class CSVtoJSON {
  private csvfilePath: string;

  constructor(csvFilePath: string) {
    this.csvfilePath = csvFilePath;
  }

  private readCSVFile(): any[] {
    const json = csvToJson({
      csvFilePath: this.csvfilePath,
      delimiter: ",",
    });
    return json;
  }

  private mapData(data: any[]): any[] {
    const mappedData = data.map((row) => ({
      CODIGO: row.CODIGO,
      DENOMINACION_GENERICA_ES: row.DENOMINACION_GENERICA_ES,
      DENOMINACION_ESPECIFICA: row.DENOMINACION_ESPECIFICA,
      LOCALIDAD: row.LOCALIDAD,
      PROVINCIA: row.PROVINCIA,
      URL_ES: row.URL_ES,
    }));

    // Filtrar registros duplicados basados en el campo CODIGO
    const uniqueData = [];
    const seenCodes = new Set();

    for (const item of mappedData) {
      if (
        !item.CODIGO ||
        !item.DENOMINACION_GENERICA_ES ||
        !item.DENOMINACION_ESPECIFICA ||
        !item.LOCALIDAD ||
        !item.PROVINCIA ||
        !item.URL_ES
      ) {
        console.warn("Registro con campos faltantes, omitiendo:", item);
        continue;
      }

      if (!seenCodes.has(item.CODIGO)) {
        seenCodes.add(item.CODIGO);
        uniqueData.push(item);
      } else {
        console.warn("Registro duplicado, omitiendo:", item);
      }
    }
    return uniqueData;
  }

  public convertAndSaveJSON(outputFilePath: string): void {
    try {
      const data = this.readCSVFile();
      const mappedData = this.mapData(data);
      fs.writeFileSync(outputFilePath, JSON.stringify(mappedData, null, 2));
      console.log(`JSON file saved at: ${outputFilePath}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Ejemplo de uso:
// const converter = new CSVtoJSONMapper('input.csv');
// converter.convertAndSaveJSON('output.json');
