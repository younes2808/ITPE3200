public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public int UserId { get; set; }  // Foreign key for User
    public User Author { get; set; }  // The user who made the comment

    public int PostId { get; set; }  // Foreign key for Post
    public Post Post { get; set; }  // The post that the comment is related to
}
