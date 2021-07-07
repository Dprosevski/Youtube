using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

//2Tutorial
using SignalrDemo.EFModels;
using SignalrDemo.HubModels;

namespace SignalrDemo.HubConfig
{
    public partial class MyHub : Hub
    {
        //2Tutorial
        private readonly SignalrContext ctx;
        
        public MyHub(SignalrContext context)
        {
            ctx = context;
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            Guid currUserId = ctx.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.PersonId).SingleOrDefault();
            ctx.Connections.RemoveRange(ctx.Connections.Where(p => p.PersonId == currUserId).ToList());
            ctx.SaveChanges();
            Clients.Others.SendAsync("userOff", currUserId);//4Tutorial
            return base.OnDisconnectedAsync(exception);
        }



        //4Tutorial
        public void authMe(PersonInfo personInfo)
        {
            string currSignalrID = Context.ConnectionId;
            Person tempPerson = ctx.Person.Where(p => p.Username == personInfo.userName && p.Password == personInfo.password)
                .SingleOrDefault();

            if (tempPerson != null) //if credentials are correct
            {
                Console.WriteLine("\n" + tempPerson.Name + " logged in" + "\nSignalrID: " + currSignalrID);

                Connections currUser = new Connections
                {
                    PersonId = tempPerson.Id,
                    SignalrId = currSignalrID,
                    TimeStamp = DateTime.Now
                };
                ctx.Connections.Add(currUser);
                ctx.SaveChanges();

                User newUser = new User(tempPerson.Id, tempPerson.Name, currSignalrID);
                Clients.Caller.SendAsync("authMeResponseSuccess", newUser);//4Tutorial
                Clients.Others.SendAsync("userOn", newUser);//4Tutorial
            }

            else //if credentials are incorrect
            {
                Clients.Caller.SendAsync("authMeResponseFail");
            }
        }


        //3Tutorial
        public void reauthMe(Guid personId)
        {
            string currSignalrID = Context.ConnectionId;
            Person tempPerson = ctx.Person.Where(p => p.Id == personId)
                .SingleOrDefault();

            if (tempPerson != null) //if credentials are correct
            {
                Console.WriteLine("\n" + tempPerson.Name + " logged in" + "\nSignalrID: " + currSignalrID);

                Connections currUser = new Connections
                {
                    PersonId = tempPerson.Id,
                    SignalrId = currSignalrID,
                    TimeStamp = DateTime.Now
                };
                ctx.Connections.Add(currUser);
                ctx.SaveChanges();

                User newUser = new User(tempPerson.Id, tempPerson.Name, currSignalrID);
                Clients.Caller.SendAsync("reauthMeResponse", newUser);//4Tutorial
                Clients.Others.SendAsync("userOn", newUser);//4Tutorial
            }
        } //end of reauthMe


        //4Tutorial
        public void logOut(Guid personId)
        {
            ctx.Connections.RemoveRange(ctx.Connections.Where(p => p.PersonId == personId).ToList());
            ctx.SaveChanges();
            Clients.Caller.SendAsync("logoutResponse");
            Clients.Others.SendAsync("userOff", personId);//4Tutorial
        }
    }
}
