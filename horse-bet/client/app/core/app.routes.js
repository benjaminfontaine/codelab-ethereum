import { PariComponent } from '../paris/components/pari/pari.component';
import { AboutComponent } from './components/about/about.component';

export const routes = [
  { path: '', component: PariComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent }
];
