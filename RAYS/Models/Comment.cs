public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }  // The text content of the comment
    public DateTime CreatedAt { get; set; }

    // Relationships
    public User Author { get; set; }  // The user who made the comment
    public Post Post { get; set; }  // The post that the comment is related to
}