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

import { Component, OnInit, Input, transition } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TransStudentsService } from './TransStudents.service';
import { StudentsService } from '../Students/Students.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-transstudents',
  templateUrl: './TransStudents.component.html',
  styleUrls: ['./TransStudents.component.css'],
  providers: [TransStudentsService, StudentsService]
})
export class TransStudentsComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;
  private StudentName;
  student = new FormControl('', Validators.required);
  newUniversity = new FormControl('');
  NewSchool = new FormControl('');
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTransStudents: TransStudentsService, private serviceStudents: TransStudentsService, fb: FormBuilder) {
    this.myForm = fb.group({
      student: this.student,
      NewSchool: this.NewSchool,
      newUniversity: this.newUniversity,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
    
  }

 
  loadAll(): Promise<any> {

    var that=this
    const tempList = [];
    return this.serviceTransStudents.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        console.log(transaction["student"].toString().slice(37))
        
        that.serviceStudents.getName(transaction["student"].toString().slice(37))
          .toPromise()
          .then((result1) => {
            console.log(result1)
            transaction["name"] = result1.FullName
          })
          .catch((error) => { })
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
     
      console.log(this.allTransactions)
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
  loadStudentTransaction(): Promise<any> {

    var that = this
    const tempList = [];
    console.log(this.allTransactions);
    console.log(this.StudentName);
    return this.serviceTransStudents.getTransactionByStudent(this.StudentName)
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        console.log(result);
        console.log(result[0])
        
        result.forEach(transaction => {
          console.log(transaction["student"].toString().slice(37))

          that.serviceStudents.getName(transaction["student"].toString().slice(37))
            .toPromise()
            .then((result1) => {
              console.log(result1)
              transaction["name"] = result1.FullName
            })
            .catch((error) => { })
          tempList.push(transaction);
        });
        this.allTransactions = tempList;

        console.log(this.allTransactions)
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
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.schoolsnetwork.TransStudents',
      'student': "resource:org.schoolsnetwork.Students#" + this.student.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };
    if(this.NewSchool.value){
      this.Transaction['NewSchool']= this.NewSchool.value;
    }
    if(this.newUniversity.value){
      this.Transaction['newUniversity']= this.newUniversity.value;
    }
    this.myForm.setValue({
      'student': null,
      'newUniversity': null,
      'NewSchool': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTransStudents.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'student': null,
        'newUniversity': null,
        'NewSchool': null,
        'transactionId': null,
        'timestamp': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.schoolsnetwork.TransStudents',
      'student': this.student.value,
      'NewSchool': this.NewSchool.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceTransStudents.updateTransaction(form.get('transactionId').value, this.Transaction)
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

  deleteTransaction(): Promise<any> {

    return this.serviceTransStudents.deleteTransaction(this.currentId)
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

    return this.serviceTransStudents.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'newUniversity': null,
        'student': null,
        'NewSchool': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.student) {
        formObject.student = result.student;
      } else {
        formObject.student = null;
      }

      if (result.newUniversity) {
        formObject.newUniversity = result.newUniversity;
      } else {
        formObject.newUniversity = null;
      }
      if (result.NewSchool) {
        formObject.NewSchool = result.NewSchool;
      } else {
        formObject.NewSchool = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'newUniversity': null,
      'student': null,
      'NewSchool': null,
      'transactionId': null,
      'timestamp': null
    });
  }
  onKey(event) { 
    const inputValue = event.target.value;
    this.StudentName = inputValue;}
}

