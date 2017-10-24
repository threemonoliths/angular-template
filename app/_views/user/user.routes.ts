import {UserComponent} from './user.component';
import {UserListComponent} from './list/list.component';
import {UserFormComponent} from './form/form.component';

export const userRoutes = [{
	path: '',
	component: UserComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: UserListComponent },
		{ path: 'form', component: UserFormComponent },
		{ path: 'updateform', component: UserFormComponent },
	]
}];