using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Models; // Ensure you have included your Post and DbContext models
using ServerAPI.DAL;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ServerAPIContext _context; // Ensure the correct type for the context
        private readonly ILogger<PostController> _logger;

        public PostController(ServerAPIContext context, ILogger<PostController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] PostRequestModel model)
        {
            // Check if the model is null or content is empty
            if (model == null || string.IsNullOrEmpty(model.Content))
            {
                _logger.LogWarning("CreatePost: Model is null or content is empty.");
                return BadRequest("Post content cannot be empty.");
            }

            // Log the model properties for debugging
            _logger.LogInformation($"Received post with Content: {model.Content}, VideoUrl: {model.VideoUrl}, UserId: {model.UserId}, Location: {model.Location}");

            // Fetch the author user from the database
            var author = await _context.Users.FindAsync(model.UserId);
            if (author == null) // Ensure the author exists
            {
                _logger.LogWarning($"CreatePost: No user found with ID {model.UserId}.");
                return NotFound("Author not found.");
            }

            // Handle image upload
            string? imagePath = null;
            if (model.Image != null && model.Image.Length > 0)
            {
                // Ensure the directory exists
                var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "PostImages");
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                // Save the image
                var fileName = Path.GetFileName(model.Image.FileName);
                var filePath = Path.Combine(directoryPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                // Store the path to the image
                imagePath = Path.Combine("PostImages", fileName);
            }

            // Explicitly set Location to null if it's an empty string
            string? location = string.IsNullOrEmpty(model.Location) ? null : model.Location;

            // Set VideoUrl to null if it's not provided
            string? videoUrl = string.IsNullOrEmpty(model.VideoUrl) ? null : model.VideoUrl;

            // Create new post with the correct user ID
            var post = new Post
            {
                Content = model.Content,
                ImagePath = imagePath,
                Location = location,  // This will be null if not provided in the request
                CreatedAt = DateTime.UtcNow, // Set timestamp
                UserId = model.UserId, // Set the UserId
                VideoUrl = videoUrl // Set VideoUrl from the request, or null if not provided
            };

            // Add the post to the context and save changes
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id); // Removed Author include

            if (post == null)
            {
                _logger.LogWarning($"GetPostById: No post found with ID {id}.");
                return NotFound();
            }

            return Ok(post);
        }

        // Optional: Method to list all posts
        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.CreatedAt) // Sort posts by CreatedAt in descending order (latest posts first)
                .Select(p => new
                {
                    p.Id,
                    p.Content,
                    p.ImagePath,
                    p.VideoUrl,
                    p.Location,
                    p.CreatedAt,
                    p.UserId,
                    LikeCount = _context.Likes.Count(l => l.PostId == p.Id) // Add like count
                })
                .ToListAsync();

            return Ok(posts);
        }


        // New API endpoint to get all posts by User ID, sorted by latest posts first
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(int userId)
        {
            var posts = await _context.Posts
                .Where(p => p.UserId == userId) // Filter by User ID
                .OrderByDescending(p => p.CreatedAt) // Sort by creation date in descending order
                .ToListAsync();

            return Ok(posts);
        }


        [HttpGet("likedby/{userId}")]
        public async Task<IActionResult> GetPostIdsLikedByUserId(int userId)
        {
            // Query the Likes table to get only the Post IDs liked by the user
            var likedPostIds = await _context.Likes
                .Where(like => like.UserId == userId)  // Filter likes by the given userId
                .Select(like => like.PostId)  // Select only the PostId from the likes
                .ToListAsync();

            // Return the list of liked post IDs
            return Ok(likedPostIds);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostById(int id)
        {
            // Find the post by its ID
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                _logger.LogWarning($"DeletePostById: No post found with ID {id}.");
                return NotFound("Post not found.");
            }

            // If the post has an associated image, delete it from the file system
            if (!string.IsNullOrEmpty(post.ImagePath))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), post.ImagePath);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            // Remove the post from the database
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"DeletePostById: Post with ID {id} has been deleted.");
            return NoContent(); // Return 204 No Content on success
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePostById(int id, [FromForm] PostRequestModel model)
        {
            // Find the post by its ID
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                _logger.LogWarning($"UpdatePostById: No post found with ID {id}.");
                return NotFound("Post not found.");
            }

            // Validate the new content
            if (string.IsNullOrEmpty(model.Content))
            {
                _logger.LogWarning("UpdatePostById: Content cannot be empty.");
                return BadRequest("Post content cannot be empty.");
            }

            // Only update the post's content, leaving other properties unchanged
            post.Content = model.Content;

            // Save the changes to the database
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"UpdatePostById: Post with ID {id} has been updated.");
            return Ok(post); // Return the updated post
        }

    }
}
