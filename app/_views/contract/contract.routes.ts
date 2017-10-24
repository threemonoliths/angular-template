import {ContractComponent} from './contract.component';
import {ContractListComponent} from './list/list.component';
import {ContractFormComponent} from './form/form.component';

export const contractRoutes = [{
	path: '',
	component: ContractComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: ContractListComponent },
		{ path: 'form', component: ContractFormComponent },
		{ path: 'updateform', component: ContractFormComponent },
	]
}];