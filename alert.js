import swal from 'sweetalert';
import wolf from './wolf';
export function failAlert() {
  window.gameOver = true;
  let stuckedWolves = wolf.wolves.filter(w => w.stuck > 0);
  swal({
    text: `你围住了${stuckedWolves.length}只狼!`,
    button: '再来一次'
  }).then(v => {
    console.log(v);
    if (v) {
      window.location.reload();
    }
  });
}
