using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangeLikeModelswithIgnore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Posts_PostId1",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_PostId1",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "PostId1",
                table: "Likes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PostId1",
                table: "Likes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Likes_PostId1",
                table: "Likes",
                column: "PostId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Posts_PostId1",
                table: "Likes",
                column: "PostId1",
                principalTable: "Posts",
                principalColumn: "Id");
        }
    }
}
