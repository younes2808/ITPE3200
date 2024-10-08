namespace ServerAPI.Models
{
    public class Friend
    {
        public int Id { get; set; }

        // Foreign key: Sender of the friend request
        public int SenderId { get; set; }

        // Foreign key: Receiver of the friend request
        public int ReceiverId { get; set; }

        // Friend request status: Pending, Accepted, Rejected
        public string Status { get; set; } = "Pending";

        // Ensure that Sender and Receiver can't be the same user
        public bool IsValid()
        {
            return SenderId != ReceiverId;
        }
    }
}
