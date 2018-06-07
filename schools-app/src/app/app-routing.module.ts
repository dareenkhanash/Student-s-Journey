/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { StudentsComponent } from './Students/Students.component';

import { SchoolComponent } from './School/School.component';

import { TransStudentsComponent } from './TransStudents/TransStudents.component';
import { UniversityComponent } from './university/university.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Students', component: StudentsComponent },
  { path: 'School', component: SchoolComponent },
  { path: 'TransStudents', component: TransStudentsComponent },
  { path: 'Universities', component: UniversityComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
