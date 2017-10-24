import {DictionaryComponent } from './dictionary.component';
import {DictionaryListComponent} from './list/list.component';
import {DictionaryFormComponent} from './form/form.component';

export const dictionaryRoutes = [{
	path: '',
	component: DictionaryComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: DictionaryListComponent },
		{ path: 'form', component: DictionaryFormComponent },
		{ path: 'updateform', component: DictionaryFormComponent },
	]
}];