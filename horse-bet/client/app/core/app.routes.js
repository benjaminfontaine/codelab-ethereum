import { PariComponent } from '../paris/components/pari/pari.component';
import { AboutComponent } from './components/about/about.component';
import { OracleComponent } from './components/oracle/oracle.component';
import { WalletComponent } from './components/wallet/wallet.component';

export const routes = [
  { path: '', component: PariComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'oracle', component: OracleComponent },
  { path: 'wallet', component: WalletComponent }
];
