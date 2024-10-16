// Verifica si el navegador soporta la API de medios
const video = document.getElementById("qr-video");
const fullName = document.getElementById("full-name");
const phone = document.getElementById("phone");
const startScanButton = document.getElementById("start-scan");

let scanning = false;

// Al hacer clic en el botón, iniciamos el escaneo QR
startScanButton.addEventListener("click", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("La API de la cámara no es compatible con este navegador.");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      scanning = true;

      // Escuchar el video para detectar el QR usando la librería jsQR
      video.addEventListener("loadedmetadata", () => {
        scanQRCode();
      });
    })
    .catch((err) => {
      console.error("Error accediendo a la cámara: ", err);
    });
});

// Función para escanear el código QR
function scanQRCode() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    const data = JSON.parse(code.data);

    fullName.textContent = data.full_name;
    phone.textContent = data.phone;
    scanning = false;
    video.srcObject.getTracks().forEach((track) => track.stop());
  }

  if (scanning) {
    requestAnimationFrame(scanQRCode);
  }
}
