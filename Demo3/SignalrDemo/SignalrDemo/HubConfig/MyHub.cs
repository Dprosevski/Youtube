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
    public class MyHub : Hub
    {
        //2Tutorial
        private readonly SignalrContext ctx;
        
        public MyHub(SignalrContext context)
        {
            ctx = context;
        }


        //2Tutorial
        public async Task authMe(PersonInfo personInfo)
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
                await ctx.Connections.AddAsync(currUser);
                await ctx.SaveChangesAsync();

                await Clients.Caller.SendAsync("authMeResponseSuccess", tempPerson);
            }

            else //if credentials are incorrect
            {
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }
    }
}
