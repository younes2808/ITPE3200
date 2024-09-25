using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.DAL;
using ServerAPI.Models;
using System.Threading.Tasks;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ServerAPIContext _context;

        public UserController(ServerAPIContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegistrationRequest request)
        {
            // Validate incoming user data
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Invalid user data.");
            }

            // Check if the username or email already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
            {
                return Conflict("Username or email already exists.");
            }

            // Create a new User instance
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password) // Hash the password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return created response with user details (without password hash)
            return CreatedAtAction(nameof(Register), new { id = user.Id }, new { user.Id, user.Username, user.Email });
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            // Validate incoming login data
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Invalid login data.");
            }

            // Fetch user from the database by username or email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Username);

            if (user == null)
            {
                return Unauthorized("No such username ");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid password.");
            }

            // Return user data excluding password
            return Ok(new { user.Id, user.Username, user.Email });
        }

            }
}
