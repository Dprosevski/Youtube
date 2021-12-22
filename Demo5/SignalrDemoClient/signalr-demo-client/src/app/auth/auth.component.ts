import { AuthService } from './auth.service';
import { SignalrService } from './../signalr.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

//2Tutorial
export class AuthComponent implements OnInit, OnDestroy {
  
  constructor(
    public signalrService: SignalrService,
    public authService: AuthService //3Tutorial
  ) { }

  //3Tutorial
  ngOnInit(): void {
    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();
  }

   //3Tutorial
  ngOnDestroy(): void {
    this.signalrService.hubConnection.off("authMeResponseSuccess");
    this.signalrService.hubConnection.off("authMeResponseFail");
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.authMe(form.value.userName, form.value.password);
    form.reset();
  }





}
