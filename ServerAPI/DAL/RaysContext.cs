// DAL/RAYSContext.cs
using Microsoft.EntityFrameworkCore;
using RAYS.Models;  // Assuming models are in the "Models" folder

namespace YourApp.DAL
{
    public class RAYSContext : DbContext
    {
        public RAYSContext(DbContextOptions<RAYSContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the many-to-many relationship between User and Post through Like
            modelBuilder.Entity<Like>()
                .HasKey(l => new { l.UserId, l.PostId });

            modelBuilder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId);

            modelBuilder.Entity<Like>()
                .HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId);
        }
    }
}
