import {TransferComponent} from './transfer.component';
import {TransferListComponent} from './list/list.component';
import {TransferFormComponent} from './form/form.component';

export const transferRoutes = [{
	path: '',
	component: TransferComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: TransferListComponent },
		{ path: 'form', component: TransferFormComponent },
		{ path: 'updateform', component: TransferFormComponent },
	]
}];