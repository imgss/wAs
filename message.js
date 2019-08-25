import wImg from './img/wolf.png';
import sImg from './img/sheep1.png';

let msg = document.getElementById('message');
let avatar = msg.querySelector('img');
let content = msg.querySelector('div');
function show(who, word) {
  avatar.src = who === 'wolf' ? wImg : sImg;
  content.textContent = word;
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 2000);
}
export default show;