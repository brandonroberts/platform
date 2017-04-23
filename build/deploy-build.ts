import * as tasks from './tasks';
import { createBuilder } from './util';
import { packages } from './config';


const deploy = createBuilder([
  [ 'Deploy builds', tasks.publishToRepo ]
]);

deploy({
  scope: '@ngrx',
  packages: packages.filter(pkg => pkg === 'store')
}).catch(err => {
  console.error(err);
  process.exit(1);
});
