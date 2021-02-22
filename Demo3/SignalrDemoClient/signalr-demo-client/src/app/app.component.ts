import { AuthService } from './auth/auth.service';
import { SignalrService } from './signalr.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor( 
    public signalrService: SignalrService,
    public authService: AuthService //3Tutorial
  ) 
  {}


  ngOnInit() {
    this.signalrService.startConnection();


  }

  
  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
  }

}

