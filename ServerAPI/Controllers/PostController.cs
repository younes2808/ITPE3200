using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Models; // Make sure to include your Post and DbContext models
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

        public PostController(ServerAPIContext context, ILogger<PostController> logger) // Use the correct type for the context
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

            // Create new post with a guaranteed author
            var post = new Post
            {
                Content = model.Content,
                ImagePath = imagePath,
                Location = model.Location,
                CreatedAt = DateTime.UtcNow, // Set timestamp
                Author = author // We know author is not null here
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
                .Include(p => p.Author) // Include the author to get user info
                .FirstOrDefaultAsync(p => p.Id == id);

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
            var posts = await _context.Posts.Include(p => p.Author).ToListAsync();
            return Ok(posts);
        }
    }}

    // Model for creating a post request
