import { PariComponent } from './components/pari/pari.component';
import { OracleComponent } from './components/oracle/oracle.component';
import { WalletComponent } from './components/wallet/wallet.component';

export const routes = [
  { path: '', component: PariComponent, pathMatch: 'full' },
  { path: 'oracle', component: OracleComponent },
  { path: 'wallet', component: WalletComponent }
];
