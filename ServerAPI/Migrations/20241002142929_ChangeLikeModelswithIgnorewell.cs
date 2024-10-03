using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangeLikeModelswithIgnorewell : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Users_UserId1",
                table: "Likes");

            migrationBuilder.DropIndex(
                name: "IX_Likes_UserId1",
                table: "Likes");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Likes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Likes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Likes_UserId1",
                table: "Likes",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Users_UserId1",
                table: "Likes",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
