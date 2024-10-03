using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ServerAPI.Models
{    
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]  // This hides the Id in Swagger
        public int Id { get; set; }  // The ID will be auto-incremented by the database

        public required string Text { get; set; }

        public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public required int UserId { get; set; }  // Foreign key for User

        public required int PostId { get; set; }  // Foreign key for Post
    }
}
