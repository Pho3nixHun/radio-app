import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './pages/radio-list-page/radio-list-page.component'
        ).then((m) => m.RadioListPageComponent),
    }
];
