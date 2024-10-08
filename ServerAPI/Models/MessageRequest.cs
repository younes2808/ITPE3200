namespace ServerAPI.Models
{
    public class MessageRequest
    {
        // Foreign key: Sender of the message
        public int SenderId { get; set; }

        // Foreign key: Receiver of the message
        public int ReceiverId { get; set; }

        // The content of the message
        public required string Content { get; set; }
    }
}
