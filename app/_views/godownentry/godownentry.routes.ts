import {GodownentryComponent} from './godownentry.component';
import {GodownentryListComponent} from './list/list.component';
import {GodownentryFormComponent} from './form/form.component';

export const godownentryRoutes = [{
	path: '',
	component: GodownentryComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: GodownentryListComponent },
		{ path: 'form', component: GodownentryFormComponent},
		{ path: 'updateform', component: GodownentryFormComponent },
	]
}];