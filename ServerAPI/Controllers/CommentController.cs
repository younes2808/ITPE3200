using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.DAL;
using ServerAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ServerAPIContext _context;

        public CommentController(ServerAPIContext context)
        {
            _context = context;
        }

        // POST: api/Comment (Add a comment to a post)
        [HttpPost]
        public async Task<ActionResult> AddComment([FromBody] Comment comment)
        {
            // Check if the post exists
            if (!_context.Posts.Any(p => p.Id == comment.PostId))
            {
                return NotFound("Post not found.");
            }

            // Check if the user exists
            if (!_context.Users.Any(u => u.Id == comment.UserId))
            {
                return NotFound("User not found.");
            }

            // If both Post and User exist, proceed to add the comment
            comment.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo")); // Automatically set CreatedAt
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment); // Return the created comment
        }

        // GET: api/Comment/{postId} (Get all comments for a post)
        [HttpGet("{postId}")]
        public async Task<ActionResult> GetCommentsForPost(int postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Text,
                    c.CreatedAt,
                    c.UserId,
                    c.PostId
                })
                .ToListAsync();

            return Ok(comments);
        }

        // PUT: api/Comment/update
        [HttpPut("update")]
        public async Task<ActionResult> UpdateComment([FromBody] UpdateCommentRequest request)
        {
            // Find the existing comment
            var existingComment = await _context.Comments.FindAsync(request.CommentId);
            if (existingComment == null)
            {
                return NotFound("Comment not found.");
            }

            // Check if the user ID matches the one who created the comment
            if (existingComment.UserId != request.UserId)
            {
                return Unauthorized("User does not have permission to update this comment.");
            }

            // Update the comment text
            existingComment.Text = request.Text;
            await _context.SaveChangesAsync();

            return Ok(existingComment); // Return the updated comment
        }


        // DELETE: api/Comment/{id} (Delete a specific comment by userId)
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComment(int id, [FromQuery] int userId)
        {
            // Find the existing comment
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound("Comment not found.");
            }

            // Check if the user ID matches
            if (comment.UserId != userId)
            {
                return Unauthorized("User does not have permission to delete this comment.");
            }

            // Remove the comment
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 No Content status
        }
    }
}
