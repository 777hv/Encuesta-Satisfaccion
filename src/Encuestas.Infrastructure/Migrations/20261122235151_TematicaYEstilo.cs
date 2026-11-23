using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Encuestas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TematicaYEstilo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Estilo",
                table: "Encuestas",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Petroleo");

            migrationBuilder.AddColumn<string>(
                name: "Tematica",
                table: "Encuestas",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "General");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Estilo",
                table: "Encuestas");

            migrationBuilder.DropColumn(
                name: "Tematica",
                table: "Encuestas");
        }
    }
}
