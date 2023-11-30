from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def getCoordinates(address):
    # Configurar el navegador
    options = webdriver.ChromeOptions()
    ##options.add_argument("--headless")  # Ejecutar en modo headless (sin interfaz gráfica)
    driver = webdriver.Chrome(options=options)

    lat, lon, previus_lat, previus_lon = None, None, None, None  # Declarar las variables aquí

    try:
        driver.get("https://www.coordenadas-gps.com/")

        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "address")))

        for i in range(10):
            print(f"Observando cambios de valores... intento {i + 1}/10")
            previus_lat = driver.find_element(By.ID, "latitude").get_attribute("value")
            previus_lon = driver.find_element(By.ID, "longitude").get_attribute("value")

            if previus_lat != "" and previus_lon != "":
                break

            if i == 9:
                raise Exception("No se han podido obtener las coordenadas")
            else:
                time.sleep(1)

        driver.find_element(By.ID, "address").clear()
        driver.find_element(By.ID, "address").send_keys(str(address))

        driver.find_element(By.XPATH, "//*[@id='wrap']/div[2]/div[3]/div[1]/form[1]/div[2]/div/button").click()

        for i in range(10):
            print(f"Observando cambios de valores... intento {i + 1}/10")

            lat = driver.find_element(By.ID, "latitude").get_attribute("value")
            lon = driver.find_element(By.ID, "longitude").get_attribute("value")

            if lat != "" and lon != "" and lat != previus_lat and lon != previus_lon:
                break

            if i == 9:
                raise Exception("No se han podido obtener las coordenadas")
            else:
                time.sleep(1)

        return {"lat": lat, "lon": lon}
    except Exception as e:
        print(e)
    finally:
        driver.quit()


print (getCoordinates("Calle de la Princesa, 1, Madrid"))