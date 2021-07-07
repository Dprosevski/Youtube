import { SignalrService, User } from 'src/app/signalr.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        public signalrService: SignalrService,
        public router: Router
      ) {
          //3Tutorial
          let tempPersonId = localStorage.getItem("personId");
          if (tempPersonId) {
              if (this.signalrService.hubConnection?.state == 1) { //if already connected
                this.reauthMeListener();
                this.reauthMe(tempPersonId);
              }
              else {
                this.signalrService.ssSubj.subscribe((obj: any) => {
                  if (obj.type == "HubConnStarted") {
                    this.reauthMeListener();
                    this.reauthMe(tempPersonId);
                  }
                });
              }
          }
      }


    public isAuthenticated: boolean = false;



    //2Tutorial
    async authMe(person: string, pass: string) {
        let personInfo = {userName: person, password: pass};

        await this.signalrService.hubConnection.invoke("authMe", personInfo)
        .catch(err => console.error(err));
    }


    //4Tutorial
    authMeListenerSuccess() {
      this.signalrService.hubConnection.on("authMeResponseSuccess", (user: User) => {
        console.log(user);
        this.signalrService.userData = user;
        this.isAuthenticated = true;
        localStorage.setItem("personId", user.id);
        this.signalrService.toastr.success("Login successful!");
        this.signalrService.router.navigateByUrl("/home");
      });
    }

    //2Tutorial
    authMeListenerFail() {
      this.signalrService.hubConnection.on("authMeResponseFail", () => {
        this.signalrService.toastr.error("Wrong credentials!");
      });
    }


    //3Tutorial
    async reauthMe(personId: string) {
      await this.signalrService.hubConnection.invoke("reauthMe", personId)
      .catch(err => console.error(err));
    }




    //4Tutorial
    reauthMeListener() {
      this.signalrService.hubConnection.on("reauthMeResponse", (user: User) => {
        console.log(user);
        this.signalrService.userData = user;
        this.isAuthenticated = true;
        this.signalrService.toastr.success("Re-authenticated!");
        if (this.signalrService.router.url == "/auth") this.signalrService.router.navigateByUrl("/home");
      });
    }



}
