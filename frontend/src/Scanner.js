import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

function Scanner({ onResult }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(
      (result) => {
        scanner.clear(); // Detiene el escáner al encontrar un código
        onResult(result);
      },
      (error) => {
        // Ignoramos errores de lectura continua
      },
    );

    return () => scanner.clear(); // Limpieza al cerrar el componente
  }, []);

  return <div id="reader" style={{ width: "300px" }}></div>;
}

export default Scanner;
