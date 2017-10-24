import {CompanyComponent} from './company.component';
import {CompanyListComponent} from './list/list.component';
import {CompanyFormComponent} from './form/form.component';

export const companyRoutes = [{
	path: '',
	component: CompanyComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: CompanyListComponent },
		{ path: 'form', component: CompanyFormComponent },
		{ path: 'updateform', component: CompanyFormComponent },
	]
}];