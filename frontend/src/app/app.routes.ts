import { Routes } from '@angular/router';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { CallStatusComponent } from './call-status/call-status.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { CallSectionComponent } from './call-section/call-section.component';

export const routes: Routes = [
  { path: '', component: LeadFormComponent },
  { path: 'contacts', component: ContactListComponent },
  { path: 'call-section', component: CallSectionComponent },
  { path: 'call-status/:callId', component: CallStatusComponent },
  { path: '**', redirectTo: '' }
];

export const NAV_LINKS = [
  { path: '', label: 'Add Lead' },
  { path: 'contacts', label: 'Contacts' }
  // { path: 'call-section', label: 'Call' } // add when call UI exists
];
