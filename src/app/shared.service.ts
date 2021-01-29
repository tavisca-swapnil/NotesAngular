import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  functionToBeCalled = "";
  private subject = new Subject<any>();

  sendClickEvent(functionName){
    this.functionToBeCalled = functionName;
    this.subject.next();
  }

  getClickEvent():Observable<any>{
    return this.subject.asObservable();
  }

  constructor() { }
}
