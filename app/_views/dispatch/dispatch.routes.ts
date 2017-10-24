import { DispatchComponent } from './dispatch.component';
import {DispatchListComponent} from './list/list.component';
import {DispatchFormComponent} from './form/form.component';

//import { UserProfileComponent } from './user-profile/user-profile.component';

export const  dispatchRoutes = [{
	path: '',
	component:  DispatchComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: DispatchListComponent },
		{ path: 'form', component:  DispatchFormComponent },
		{ path: 'updateform', component: DispatchFormComponent },
	]
}];


