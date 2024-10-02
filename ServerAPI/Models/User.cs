using System.Text.Json.Serialization; // Add this if using System.Text.Json

namespace ServerAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }

        // Navigation properties
        [JsonIgnore] // Ignore to prevent cycles when serializing User
        public ICollection<Post> Posts { get; set; } = new List<Post>();  // Posts created by the user
        
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();  // Comments made by the user
        public ICollection<Like> Likes { get; set; } = new List<Like>();  // Posts liked by the user
    }
}
