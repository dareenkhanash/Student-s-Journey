import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.schoolsnetwork{
   export enum StudentStatus {
      Graduated,
      Enrolled,
   }
   export class Students extends Asset {
      StudentId: string;
      FullName: string;
      Birthday: string;
      Grade: string;
      GPA: number;
      Status: StudentStatus;
      CurrentSchool: School;
      newUniversity:University;
   }
   export class School extends Participant {
      Name: string;
      Email: string;
      PhoneNumber: number;
      Adress: string;
   }
   export class University extends Participant {
    universityName: string;
    Email: string;
    Adress: string;
   } 
   export class TransStudents extends Transaction {
      student: Students;
      NewSchool: School;
      newUniversity:University;
   }

// }
