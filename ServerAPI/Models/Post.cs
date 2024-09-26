namespace ServerAPI.Models
{
    public class Post
    {
        public int Id { get; set; }

        // Text content of the post
        public required string Content { get; set; }

        // Path to the uploaded image (if applicable)
        public string? ImagePath { get; set; }  // Make optional to allow text or video posts
        
        // URL for embedded video link (e.g., YouTube)
        public string? VideoUrl { get; set; }  // Optional for video content

        // Location data
        public string? Location { get; set; }  // Optional for location data

        // Timestamp for when the post was created
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Default to current time

        // Relationships
        public required User Author { get; set; }  // The user who created the post

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();  // Comments on the post
        public ICollection<Like> Likes { get; set; } = new List<Like>();  // Likes associated with the post
    }
}
