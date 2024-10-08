using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.DAL;
using ServerAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly ServerAPIContext _context;

        public FriendController(ServerAPIContext context)
        {
            _context = context;
        }

        // POST: api/friend/request
        [HttpPost("request")]
        public async Task<ActionResult> SendFriendRequest([FromBody] FriendRequest friendRequest)
        {
            // Validate that sender and receiver are not the same
            if (friendRequest.SenderId == friendRequest.ReceiverId)
                return BadRequest("Sender and receiver cannot be the same user.");

            // Check if a request already exists between the sender and receiver
            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => 
                    (f.SenderId == friendRequest.SenderId && f.ReceiverId == friendRequest.ReceiverId) ||
                    (f.SenderId == friendRequest.ReceiverId && f.ReceiverId == friendRequest.SenderId));

            if (existingRequest != null)
            {
                return Conflict("A friend request already exists between these users.");
            }

            // Create and add a new friend request with status set to "Pending"
            var newRequest = new Friend
            {
                SenderId = friendRequest.SenderId,
                ReceiverId = friendRequest.ReceiverId,
                Status = "Pending"
            };

            _context.Friends.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent successfully.");
        }

        // GET: api/friend/requests/{userId}
        [HttpGet("requests/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFriendRequests(int userId)
        {
            var requests = await _context.Friends
                .Where(f => (f.ReceiverId == userId || f.SenderId == userId) && f.Status == "Pending")
                .Select(f => new
                {
                    f.Id, // FriendRequestId (the ID of the friend request)
                    f.SenderId,
                    f.ReceiverId,
                    IsSender = f.SenderId == userId // This indicates whether the user is the sender
                })
                .ToListAsync();

            return Ok(requests);
        }

        // PUT: api/friend/accept/{id}
        [HttpPut("accept/{id}")]
        public async Task<ActionResult> AcceptFriendRequest(int id)
        {
            var request = await _context.Friends.FindAsync(id);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = "Accepted";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/friend/reject/{id}
        [HttpPut("reject/{id}")]
        public async Task<ActionResult> RejectFriendRequest(int id)
        {
            var request = await _context.Friends.FindAsync(id);

            if (request == null)
                return NotFound("Friend request not found.");

            _context.Friends.Remove(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/friend/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFriends(int userId)
        {
            var friends = await _context.Friends
                .Where(f => (f.SenderId == userId || f.ReceiverId == userId) && f.Status == "Accepted")
                .Select(f => new
                {
                    FriendId = f.SenderId == userId ? f.ReceiverId : f.SenderId
                })
                .ToListAsync();

            return Ok(friends);
        }

        // DELETE: api/friend/{userId}/{friendId}
        [HttpDelete("{userId}/{friendId}")]
        public async Task<ActionResult> DeleteFriend(int userId, int friendId)
        {
            // Find the friend relationship where userId is either the sender or the receiver
            var friendRelationship = await _context.Friends
                .FirstOrDefaultAsync(f =>
                    (f.SenderId == userId && f.ReceiverId == friendId) ||
                    (f.SenderId == friendId && f.ReceiverId == userId) &&
                    f.Status == "Accepted");

            if (friendRelationship == null)
            {
                return NotFound("Friend relationship not found.");
            }

            _context.Friends.Remove(friendRelationship);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
