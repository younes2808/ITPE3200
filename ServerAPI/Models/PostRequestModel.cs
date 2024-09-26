    namespace ServerAPI.Models{
    public class PostRequestModel
    {
    public required string Content { get; set; }
    public IFormFile? Image { get; set; }  // For image uploads
    public string? Location { get; set; }  // Optional location field
    public int UserId { get; set; }  // User ID for the post author
    }
}
