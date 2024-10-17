using System;

namespace ServerAPI.Models
{
    public class Message
    {
        public int Id { get; set; }

        // Foreign key: Sender of the message
        public int SenderId { get; set; }

        // Foreign key: Receiver of the message
        public int ReceiverId { get; set; }

        // The content of the message
        public required string Content { get; set; }

        // Timestamp of when the message was sent
        public DateTime Timestamp { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo"));
    }
}
