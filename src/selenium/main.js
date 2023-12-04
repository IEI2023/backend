const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function getCoordinates(address) {
  // Configurar el navegador

  const driver = await new Builder().forBrowser("chrome").build();
  let lat = "";
  let lon = "";
  let previus_lat = "";
  let previus_lon = ""; // Declarar las variables aquí

  try {
    await driver.get("https://www.coordenadas-gps.com/");

    await driver.wait(until.elementLocated(By.id("address")), 10000);

    for (let i = 0; i < 10; i++) {
      console.log("Introduciendo datos... intento " + (i + 1) + "/10");
      previus_lat = await driver
        .findElement(By.id("latitude"))
        .getAttribute("value");
      previus_lon = await driver
        .findElement(By.id("longitude"))
        .getAttribute("value");

      if (previus_lat !== "" && previus_lon !== "") {
        break;
      }

      if (i == 9) {
        //throw new Error("No se han podido obtener las coordenadas");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await driver.findElement(By.id("address")).clear();
    await driver.findElement(By.id("address")).sendKeys(address.toString());

    await driver
      .findElement(
        By.xpath(
          '//*[@id="wrap"]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button'
        )
      )
      .click();

    /** 
    console.log("Obteniendo nuevas coordenadas...");
    lat = await driver.findElement(By.id("latitude")).getAttribute("value");
    lon = await driver.findElement(By.id("longitude")).getAttribute("value");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    */

    for (let i = 0; i < 100; i++) {
      console.log(
        "Observando cambios de valores... intento " + (i + 1) + "/100"
      );

      lat = await driver.findElement(By.id("latitude")).getAttribute("value");
      lon = await driver.findElement(By.id("longitude")).getAttribute("value");

      if (
        lat !== "" &&
        lon !== "" &&
        lat !== previus_lat &&
        lon !== previus_lon
      ) {
        break;
      }

<<<<<<< HEAD
      if (i == 99) {
        throw new Error("No se han podido obtener las coordenadas");
=======
      if (i == 9) {
        //throw new Error("No se han podido obtener las coordenadas");
>>>>>>> a54f026c95a13cc49817c0397c7a3bee98b50893
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return { lat, lon };
  } catch (error) {
    console.log(error);
  } finally {
    await driver.quit();
  }
}

module.exports = { getCoordinates };
<<<<<<< HEAD
=======

//Ejemplo de uso
/*
(async () => {
  const coordinates = await getCoordinates("Lima Metropolitana, Lima, Perú");
  console.log(coordinates);
})();
*/
>>>>>>> a54f026c95a13cc49817c0397c7a3bee98b50893
