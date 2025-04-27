window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("node-version").innerText     = process.versions.node;
    document.getElementById("electron-version").innerText = process.versions.electron;
    document.getElementById("chrome-version").innerText   = process.versions.chrome;
  });