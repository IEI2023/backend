const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function getCoordinates(address) {
  // Configurar el navegador
  const driver = await new Builder().forBrowser("chrome").build();
  let lat, lon, previus_lat, previus_lon; // Declarar las variables aquí

  try {
    await driver.get("https://www.coordenadas-gps.com/");

    await driver.wait(until.elementLocated(By.id("address")), 10000);

    for (let i = 0; i < 10; i++) {
      console.log(
        "Observando cambios de valores... intento " + (i + 1) + "/10"
      );
      previus_lat = await driver
        .findElement(By.id("latitude"))
        .getAttribute("value");
      previus_lon = await driver
        .findElement(By.id("longitude"))
        .getAttribute("value");

      if (previus_lat !== "" && previus_lon !== "") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await driver.findElement(By.id("address")).clear();
    await driver.findElement(By.id("address")).sendKeys(address.toString());

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[2]/div[2]/div[3]/div[1]/form[1]/div[2]/div/button"
        )
      )
      .click();

    /** 
    console.log("Obteniendo nuevas coordenadas...");
    lat = await driver.findElement(By.id("latitude")).getAttribute("value");
    lon = await driver.findElement(By.id("longitude")).getAttribute("value");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    */

    for (let i = 0; i < 10; i++) {
      console.log(
        "Observando cambios de valores... intento " + (i + 1) + "/10"
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

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return { lat, lon };
  } catch (error) {
    console.log(error);
  } finally {
    await driver.quit();
  }
}

module.exports = { getCoordinates };

//Ejemplo de uso
/*
(async () => {
  const coordinates = await getCoordinates(
    "Camino de la Silla, 30835 Alcantarilla, España"
  );
  console.log(coordinates);
})();
*/
