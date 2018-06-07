import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { University } from '../org.schoolsnetwork';
import 'rxjs/Rx';

@Injectable()
export class UniversityService {

  private NAMESPACE = 'University';

  constructor(private dataService: DataService<University>) {
  };

  public getAll(): Observable<University[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getparticipant(id: any): Observable<University> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<University> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<University> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<University> {
    return this.dataService.delete(this.NAMESPACE, id);
  }

}
