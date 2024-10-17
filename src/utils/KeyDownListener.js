import Physics from './Physics';

export default function(event, ref, camera, zero) {
  //if (event.which === 32) {
    Physics.shoot(1, ref, event, camera, zero);
  //}
}
