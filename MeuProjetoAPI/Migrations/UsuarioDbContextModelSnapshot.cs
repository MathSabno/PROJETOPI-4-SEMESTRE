﻿// <auto-generated />
using MeuProjetoAPI.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MeuProjetoAPI.Migrations
{
    [DbContext(typeof(SiteDbContext))]
    partial class UsuarioDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MeuProjetoAPI.Entidades.ProdutoEntidade", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Avaliacao")
                        .HasColumnType("int");

                    b.Property<string>("CaminhoImg")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(2000)");

                    b.Property<string>("Descricao")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(2000)");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(200)");

                    b.Property<decimal>("Preco")
                        .HasColumnType("DECIMAL(18, 2)");

                    b.Property<int>("Quantidade")
                        .HasColumnType("INT");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Produto");
                });

            modelBuilder.Entity("MeuProjetoAPI.Entidades.UsuarioEntidade", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Cpf")
                        .IsRequired()
                        .HasColumnType("VARCHAR(14)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(255)");

                    b.Property<int>("Grupo")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(100)");

                    b.Property<string>("Senha")
                        .IsRequired()
                        .HasColumnType("VARCHAR(255)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Usuarios");
                });
#pragma warning restore 612, 618
        }
    }
}
