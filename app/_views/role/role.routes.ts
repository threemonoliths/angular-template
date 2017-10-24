import {RoleComponent} from './role.component';
import {RoleListComponent} from './list/list.component';
import {RoleFormComponent} from './form/form.component';

export const RoleRoutes = [{
	path: '',
	component: RoleComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: RoleListComponent },
		{ path: 'form', component: RoleFormComponent },
		{ path: 'updateform', component: RoleFormComponent }
	]
}];