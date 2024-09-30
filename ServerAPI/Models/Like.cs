namespace ServerAPI.Models
{
public class Like
{
    public required int UserId { get; set; }
    public required User User { get; set; }

    public required int PostId { get; set; }
    public required Post Post { get; set; }

    public DateTime LikedAt { get; set; } = DateTime.UtcNow;  // Use UTC for consistency

    public Like()
    {
        // Initialization logic if needed
    }
}
}