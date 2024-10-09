namespace ServerAPI.Models{// Define a request model for updating a comment
    public class UpdateCommentRequest
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public required string Text { get; set; }
    }
}