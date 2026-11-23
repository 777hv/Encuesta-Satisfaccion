using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Encuestas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PreguntaObligatoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Obligatoria",
                table: "Preguntas",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Obligatoria",
                table: "Preguntas");
        }
    }
}
