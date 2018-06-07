import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UniversityService } from './university.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css'],
  providers: [UniversityService]
})
export class UniversityComponent implements OnInit {
  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  universityName = new FormControl('', Validators.required);
  Email = new FormControl('', Validators.required);
  Adress = new FormControl('', Validators.required);


  constructor(private serviceUniversity: UniversityService, fb: FormBuilder) {
    this.myForm = fb.group({
      universityName: this.universityName,
      Email: this.Email,
      Adress: this.Adress
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceUniversity.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} universityName - the universityName of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(universityName: string, value: any): void {
    const index = this[universityName].value.indexOf(value);
    if (index === -1) {
      this[universityName].value.push(value);
    } else {
      this[universityName].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} universityName - the universityName of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(universityName: string, value: any): boolean {
    return this[universityName].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.schoolsnetwork.University',
      'universityName': this.universityName.value,
      'Email': this.Email.value,
      'Adress': this.Adress.value
    };

    this.myForm.setValue({
      'universityName': null,
      'Email': null,
      'Adress': null
    });

    return this.serviceUniversity.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'universityName': null,
        'Email': null,
        'Adress': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.schoolsnetwork.University',
      'Email': this.Email.value,
      'Adress': this.Adress.value
    };

    return this.serviceUniversity.updateParticipant(form.get('universityName').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceUniversity.deleteParticipant(this.currentId)
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

    return this.serviceUniversity.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'universityName': null,
        'Email': null,
        'Adress': null
      };

      if (result.universityName) {
        formObject.universityName = result.universityName;
      } else {
        formObject.universityName = null;
      }

      if (result.Email) {
        formObject.Email = result.Email;
      } else {
        formObject.Email = null;
      }



      if (result.Adress) {
        formObject.Adress = result.Adress;
      } else {
        formObject.Adress = null;
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
      'universityName': null,
      'Email': null,
      'Adress': null
    });
  }
}
