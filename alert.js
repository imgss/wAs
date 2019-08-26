import swal from './modal';
import wolf from './wolf';
export function failAlert() {
  window.gameOver = true;
  let stuckedWolves = wolf.wolves.filter(w => w.stuck > 0);
  swal({
    text: `you killed ${stuckedWolves.length} wolves!`,
    buttons: ['REPLAY']
  }).then(v => {
    if (v) {
      window.location.reload();
    }
  });
}
