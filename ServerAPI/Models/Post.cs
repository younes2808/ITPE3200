public class Post
{
    public int Id { get; set; }
    public required string Content { get; set; }  // Text content of the post
    public DateTime CreatedAt { get; set; }
    public required string ImagePath { get; set; }  // Path to the uploaded image

    // Relationships
    public required User Author { get; set; }  // The user who created the post
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();  // Comments on the post
    public ICollection<Like> Likes { get; set; } = new List<Like>();  // Likes associated with the post
}
