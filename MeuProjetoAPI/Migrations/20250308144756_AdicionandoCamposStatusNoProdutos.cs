using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeuProjetoAPI.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoCamposStatusNoProdutos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Produto",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Produto");
        }
    }
}
