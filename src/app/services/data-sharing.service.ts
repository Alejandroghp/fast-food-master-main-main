import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  setData(data: any): void {
    this.dataSubject.next(data);
  }

  getData(): Observable<any> {
    return this.data$;
  }
}
