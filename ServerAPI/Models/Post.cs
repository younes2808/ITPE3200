using System.Text.Json.Serialization;  // For the JsonIgnore attribute

namespace ServerAPI.Models
{
    public class Post
    {
        public int Id { get; set; }

        // Text content of the post
        public required string Content { get; set; }

        // Path to the uploaded image (if applicable)
        public string? ImagePath { get; set; }  // Optional to allow text or video posts
        
        // URL for embedded video link (e.g., YouTube)
        public string? VideoUrl { get; set; }  // Optional for video content

        // Location data (could be a string, or you could create a separate class for coordinates)
        public string? Location { get; set; }  // Optional for location data

        // Timestamp for when the post was created
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Default to current time

        // Foreign key for the user who created the post
        public required int UserId { get; set; }  // Marked as require
    }
}
