import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class SignalrService {
    constructor(
        public toastr: ToastrService,
        public router: Router //Added in tutorial 2
        ) { }


    hubConnection:signalR.HubConnection;
    //Added in tutorial 2
    personName: string;

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
        })
        .catch(err => console.log('Error while starting connection: ' + err))
    }


}
