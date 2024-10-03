using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.DAL;
using ServerAPI.Models;
using System.Threading.Tasks;
using System.Linq;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly ServerAPIContext _context;

        public LikeController(ServerAPIContext context)
        {
            _context = context;
        }

        // POST: api/Like (To Like a Post)
        [HttpPost]
        public async Task<ActionResult> LikePost([FromBody] Like like)
        {
            // Check if the Like already exists
            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.UserId == like.UserId && l.PostId == like.PostId);

            if (existingLike != null)
            {
                return Conflict("Post already liked by this user.");
            }

            // Add the new like
            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            return Ok("Post liked successfully.");
        }

        // DELETE: api/Like (To Unlike a Post)
        [HttpDelete]
        public async Task<ActionResult> UnlikePost([FromBody] Like like)
        {
            // Find the Like record
            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.UserId == like.UserId && l.PostId == like.PostId);

            if (existingLike == null)
            {
                return NotFound("Like not found.");
            }

            // Remove the like
            _context.Likes.Remove(existingLike);
            await _context.SaveChangesAsync();

            return Ok("Post unliked successfully.");
        }

        // GET: api/Like/{postId} (To Get All Likes for a Post)
        [HttpGet("{postId}")]
        public async Task<ActionResult> GetLikesForPost(int postId)
        {
            // Get all likes for the given postId
            var likes = await _context.Likes
                .Where(l => l.PostId == postId)
                .Select(l => new { l.UserId, l.LikedAt })
                .ToListAsync();

            return Ok(likes);
        }
    }
}
