public class User
{
    public required int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }

    // Navigation properties
    public ICollection<Post> Posts { get; set; } = new List<Post>();  // Posts created by the user
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();  // Comments made by the user
    public ICollection<Like> Likes { get; set; } = new List<Like>();  // Posts liked by the user
}
