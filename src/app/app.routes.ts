import { Routes } from '@angular/router';
import { GooglemapComponent } from './components/googlemap/googlemap.component';

export const routes: Routes = [
  {path: '', component: GooglemapComponent},
  {path: 'googlemap', component: GooglemapComponent},

];
