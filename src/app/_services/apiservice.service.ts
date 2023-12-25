import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  public loadingBS = new BehaviorSubject(0);
  
  public messagesBS = new BehaviorSubject<string>('');
  public messages$ = this.messagesBS.asObservable();

  constructor() { }
}
