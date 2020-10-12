import { SignalrService } from './signalr.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor( 
    public signalrService: SignalrService
  ) 
  {}


  ngOnInit() {
    this.signalrService.startConnection();

    setTimeout(() => {
      this.signalrService.askServerListener();
      this.signalrService.askServer();
    }, 2000);
  }

  
  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
  }

}

