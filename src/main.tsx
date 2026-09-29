import '@fontsource/dela-gothic-one';
import { runSandbox } from './dev/sandbox';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const params = new URLSearchParams(location.search);

if (params.has('sandbox')) {
  runSandbox(canvas);
}
document.getElementById('boot')?.remove();
