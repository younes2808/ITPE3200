public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    // Navigation properties
    public ICollection<Post> Posts { get; set; }  // Posts created by the user
    public ICollection<Comment> Comments { get; set; }  // Comments made by the user
    public ICollection<Like> Likes { get; set; }  // Posts liked by the user
}