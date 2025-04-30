window.addEventListener('DOMContentLoaded', async () => {
  const {
    node, electron, chrome, chatURL,
    arch, platform, hostname, homedir, tmpdir, cwd, appPath
  } = await window.electronAPI.getInfo();

  // versiones / URL
  document.getElementById('infoNode').textContent     = node;
  document.getElementById('infoElectron').textContent = electron;
  document.getElementById('infoChrome').textContent   = chrome;
  document.getElementById('infoURL').textContent      = chatURL;

  // nuevos datos de sistema
  document.getElementById('infoArch').textContent     = arch;
  document.getElementById('infoPlatform').textContent = platform;
  document.getElementById('infoHost').textContent     = hostname;
  document.getElementById('infoHome').textContent     = homedir;
  document.getElementById('infoTemp').textContent     = tmpdir;
  document.getElementById('infoCwd').textContent      = cwd;
  document.getElementById('infoApp').textContent      = appPath;

  // Generar QR
  new QRCode(document.getElementById('qrcode'), {
    text: chatURL,
    width: 128,
    height: 128
  });

  // Mensajes del servidor
  window.electronAPI.onServerMsg(msg => {
    const d = document.getElementById('display');
    d.innerHTML += `<p>${msg}</p>`;
    d.scrollTop = d.scrollHeight;
  });

  // Test button
  document.getElementById('btn_test').onclick = () => {
    window.electronAPI.broadcast();
  };
});