import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';


//4Tutorial
export class User {
  public id: string;
  public name: string;
  public connId: string;//signalr
}




@Injectable({ providedIn: 'root' })
export class SignalrService {
    constructor(
        public toastr: ToastrService,
        public router: Router //2Tutorial
        ) { }


    hubConnection:signalR.HubConnection;
    //4Tutorial
    userData: User;

    //3Tutorial
    ssSubj = new Subject<any>();
    ssObs(): Observable<any> {
        return this.ssSubj.asObservable();
    }

    startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:5001/toastr', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();

        this.hubConnection
        .start()
        .then(() => {
            this.ssSubj.next({type: "HubConnStarted"});
        })
        .catch(err => console.log('Error while starting connection: ' + err))
    }


}
