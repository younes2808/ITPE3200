namespace ServerAPI.Models
{
    public class Like
    {
        public int UserId { get; set; }  // Foreign key to User

        public int PostId { get; set; }   // Foreign key to Post

        public DateTime LikedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo"));
    }
}