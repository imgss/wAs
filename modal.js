import './css/modal.css';

export default function modal(config) {
  let conEl = document.createElement('div');
  conEl.className = 'modal-con';
  let innerHtml = `
  <div class='modal'>
    <div class="bd">${config.text}</div>
    <div class="ft">
    ${config.buttons.map(bt => '<button>' + bt + '</button>').join('')}
    </div>
  </div>
  `;
  conEl.innerHTML = innerHtml;
  document.body.appendChild(conEl);
  return new Promise((resolve, reject) => {
    conEl.addEventListener('click', function(evt) {
      if (evt.target.textContent === config.buttons.slice(-1)[0]) {
        resolve(true);
      } else {
        resolve();
      }
      conEl.remove();
    });
  });
}