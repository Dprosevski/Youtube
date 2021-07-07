using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//4Tutorial
using SignalrDemo.EFModels;
using SignalrDemo.HubModels;
using Microsoft.AspNetCore.SignalR;

namespace SignalrDemo.HubConfig
{
    public partial class MyHub
    {
        public void getOnlineUsers()
        {
            Guid currUserId = ctx.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.PersonId).SingleOrDefault();
            List<User> onlineUsers = ctx.Connections
                .Where(c => c.PersonId != currUserId)
                .Select(c => 
                    new User(c.PersonId, ctx.Person.Where(p => p.Id == c.PersonId).Select(p => p.Name).SingleOrDefault(), c.SignalrId)
                ).ToList();
            Clients.Caller.SendAsync("getOnlineUsersResponse", onlineUsers);
        }
    }
}
