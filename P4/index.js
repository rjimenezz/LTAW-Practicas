window.addEventListener('DOMContentLoaded', async () => {
    const { node, electron, chrome, chatURL } = await window.electronAPI.getInfo();
    document.getElementById('infoNode').textContent     = node;
    document.getElementById('infoElectron').textContent = electron;
    document.getElementById('infoChrome').textContent   = chrome;
    document.getElementById('infoURL').textContent      = chatURL;
  
    // listen for server‐forwarded chat messages
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