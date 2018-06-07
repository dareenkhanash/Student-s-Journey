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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { StudentsService } from './Students.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-students',
  templateUrl: './Students.component.html',
  styleUrls: ['./Students.component.css'],
  providers: [StudentsService]
})
export class StudentsComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  StudentId = new FormControl('', Validators.required);
  FullName = new FormControl('', Validators.required);
  Birthday = new FormControl('', Validators.required);
  Grade = new FormControl('', Validators.required);
  GPA = new FormControl('', Validators.required);
  Status = new FormControl('', Validators.required);
  CurrentSchool = new FormControl('', Validators.required);

  constructor(private serviceStudents: StudentsService, fb: FormBuilder) {
    this.myForm = fb.group({
      StudentId: this.StudentId,
      FullName: this.FullName,
      Birthday: this.Birthday,
      Grade: this.Grade,
      GPA: this.GPA,
      Status: this.Status,
      CurrentSchool: this.CurrentSchool
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceStudents.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.schoolsnetwork.Students',
      'StudentId': this.StudentId.value,
      'FullName': this.FullName.value,
      'Birthday': this.Birthday.value,
      'Grade': this.Grade.value,
      'GPA': this.GPA.value,
      'Status': this.Status.value,
      'CurrentSchool': this.CurrentSchool.value
    };

    this.myForm.setValue({
      'StudentId': null,
      'FullName': null,
      'Birthday': null,
      'Grade': null,
      'GPA': null,
      'Status': null,
      'CurrentSchool': null
    });

    return this.serviceStudents.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'StudentId': null,
        'FullName': null,
        'Birthday': null,
        'Grade': null,
        'GPA': null,
        'Status': null,
        'CurrentSchool': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.schoolsnetwork.Students',
      'FullName': this.FullName.value,
      'Birthday': this.Birthday.value,
      'Grade': this.Grade.value,
      'GPA': this.GPA.value,
      'Status': this.Status.value,
      'CurrentSchool': this.CurrentSchool.value
    };

    return this.serviceStudents.updateAsset(form.get('StudentId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceStudents.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceStudents.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'StudentId': null,
        'FullName': null,
        'Birthday': null,
        'Grade': null,
        'GPA': null,
        'Status': null,
        'CurrentSchool': null
      };

      if (result.StudentId) {
        formObject.StudentId = result.StudentId;
      } else {
        formObject.StudentId = null;
      }

      if (result.FullName) {
        formObject.FullName = result.FullName;
      } else {
        formObject.FullName = null;
      }

      if (result.Birthday) {
        formObject.Birthday = result.Birthday;
      } else {
        formObject.Birthday = null;
      }

      if (result.Grade) {
        formObject.Grade = result.Grade;
      } else {
        formObject.Grade = null;
      }

      if (result.GPA) {
        formObject.GPA = result.GPA;
      } else {
        formObject.GPA = null;
      }

      if (result.Status) {
        formObject.Status = result.Status;
      } else {
        formObject.Status = null;
      }

      if (result.CurrentSchool) {
        formObject.CurrentSchool = result.CurrentSchool;
      } else {
        formObject.CurrentSchool = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'StudentId': null,
      'FullName': null,
      'Birthday': null,
      'Grade': null,
      'GPA': null,
      'Status': null,
      'CurrentSchool': null
      });
  }

}
