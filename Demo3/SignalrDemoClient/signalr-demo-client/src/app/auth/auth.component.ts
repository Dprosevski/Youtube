import { SignalrService } from './../signalr.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

//Added in tutorial 2
export class AuthComponent implements OnInit, OnDestroy {
  
  constructor(
    public signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.authMeListenerSuccess();
    this.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection.off("authMeResponseSuccess");
    this.signalrService.hubConnection.off("authMeResponseFail");
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authMe(form.value.userName, form.value.password);
    form.reset();
  }


  async authMe(user: string, pass: string) {
    let personInfo = {userName: user, password: pass};

    await this.signalrService.hubConnection.invoke("authMe", personInfo)
    .finally(() => {
      this.signalrService.toastr.info("Loging in attempt...")
    })
    .catch(err => console.error(err));
  }



  private authMeListenerSuccess() {
    this.signalrService.hubConnection.on("authMeResponseSuccess", (personInfo: any) => {
        console.log(personInfo);
        this.signalrService.personName = personInfo.name;
        this.signalrService.toastr.success("Login successful!");
        this.signalrService.router.navigateByUrl("/home");
    });
  }


  private authMeListenerFail() {
    this.signalrService.hubConnection.on("authMeResponseFail", () => {
      this.signalrService.toastr.error("Wrong credentials!");
    });
  }


}
