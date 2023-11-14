import * as fs from "fs";
import * as xmljs from "xml-js";

class XMLtoJSON {
  private xmlFilePath: string;
  private jsonFilePath: string;

  constructor(xmlFilePath: string, jsonFilePath: string) {
    this.xmlFilePath = xmlFilePath;
    this.jsonFilePath = jsonFilePath;
  }

  private readXMLFile(): any {
    const xml = fs.readFileSync(this.xmlFilePath, "utf8");
    const json = xmljs.xml2json(xml, { compact: true, spaces: 2 });
    return JSON.parse(json);
  }

  private mapData(data: any[]): any[] {
    // creo que no se hace aquí
    return data;
  }

  public convertAndSaveJSON(outputFilePath: string): void {
    try {
      const data = this.readXMLFile();
      const mappedData = this.mapData(data);
      fs.writeFileSync(outputFilePath, JSON.stringify(mappedData, null, 2));
      console.log(`JSON file saved at: ${outputFilePath}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Ejemplo de uso:
// const converter = new XMLtoJSON('input.xml');
// converter.convertAndSaveJSON('output.json');
