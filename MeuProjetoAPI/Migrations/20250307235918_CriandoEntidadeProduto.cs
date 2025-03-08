using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeuProjetoAPI.Migrations
{
    /// <inheritdoc />
    public partial class CriandoEntidadeProduto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Produto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    Avaliacao = table.Column<int>(type: "int", nullable: false),
                    Descricao = table.Column<string>(type: "NVARCHAR(2000)", nullable: false),
                    Preco = table.Column<decimal>(type: "DECIMAL(18,2)", nullable: false),
                    Quantidade = table.Column<int>(type: "INT", nullable: false),
                    CaminhoImg = table.Column<string>(type: "NVARCHAR(2000)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produto", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Produto");
        }
    }
}
