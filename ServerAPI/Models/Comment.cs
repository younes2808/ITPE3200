namespace ServerAPI.Models
{    
    public class Comment
    {
        public required int Id { get; set; }
        public required string Text { get; set; }
        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public required int UserId { get; set; }  // Foreign key for User

        public required int PostId { get; set; }  // Foreign key for Post
    }
}