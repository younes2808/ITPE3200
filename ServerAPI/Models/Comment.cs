public class Comment
{
    public required int Id { get; set; }
    public required string Text { get; set; }
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public required int UserId { get; set; }  // Foreign key for User
    public required User Author { get; set; }  // The user who made the comment

    public required int PostId { get; set; }  // Foreign key for Post
    public required Post Post { get; set; }  // The post that the comment is related to
}
