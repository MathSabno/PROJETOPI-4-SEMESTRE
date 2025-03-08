using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeuProjetoAPI.Migrations
{
    /// <inheritdoc />
    public partial class CriandoEntidadeParaImagem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaminhoImg",
                table: "Produto");

            migrationBuilder.CreateTable(
                name: "Imagem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CaminhoImg = table.Column<string>(type: "NVARCHAR(2000)", nullable: false),
                    EhPadrao = table.Column<bool>(type: "bit", nullable: false),
                    Fk_produto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Imagem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Imagem_Produto_Fk_produto",
                        column: x => x.Fk_produto,
                        principalTable: "Produto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Imagem_Fk_produto",
                table: "Imagem",
                column: "Fk_produto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Imagem");

            migrationBuilder.AddColumn<string>(
                name: "CaminhoImg",
                table: "Produto",
                type: "NVARCHAR(2000)",
                nullable: false,
                defaultValue: "");
        }
    }
}
