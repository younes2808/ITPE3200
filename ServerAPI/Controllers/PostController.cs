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

        // New API endpoint to get all posts by User ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(int userId)
        {
            var posts = await _context.Posts
                .Where(p => p.UserId == userId) // Filter by User ID
                .ToListAsync();

            if (posts == null || !posts.Any())
            {
                _logger.LogWarning($"GetPostsByUserId: No posts found for user ID {userId}.");
                return NotFound("No posts found for the specified user ID.");
            }

            return Ok(posts);
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

            // Handle image update
            if (model.Image != null && model.Image.Length > 0)
            {
                // Delete the old image if it exists
                if (!string.IsNullOrEmpty(post.ImagePath))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), post.ImagePath);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Save the new image
                var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "PostImages");
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                var fileName = Path.GetFileName(model.Image.FileName);
                var filePath = Path.Combine(directoryPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                post.ImagePath = Path.Combine("PostImages", fileName); // Update image path
            }

            // Update content and location
            post.Content = model.Content;
            post.Location = string.IsNullOrEmpty(model.Location) ? null : model.Location; // Update location, set to null if empty

            // Save the changes to the database
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"UpdatePostById: Post with ID {id} has been updated.");
            return Ok(post); // Return updated post
        }

    }
}
