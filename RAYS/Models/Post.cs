public class Post
{
    public int Id { get; set; }
    public string Content { get; set; }  // Text content of the post
    public DateTime CreatedAt { get; set; }

    // New: Image path or URL for the post
    public string ImagePath { get; set; }  // Path to the uploaded image

    // Relationships
    public User Author { get; set; }  // The user who created the post
    public ICollection<Comment> Comments { get; set; }  // Comments on the post
    public ICollection<Like> Likes { get; set; }  // Likes associated with the post
}