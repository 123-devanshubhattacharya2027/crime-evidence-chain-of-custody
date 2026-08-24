using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrimeEvidence.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCaseManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CrimeLocation",
                table: "Cases",
                newName: "Location");

            migrationBuilder.AlterColumn<string>(
                name: "CaseNumber",
                table: "Cases",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Cases",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Cases");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Cases",
                newName: "CrimeLocation");

            migrationBuilder.AlterColumn<string>(
                name: "CaseNumber",
                table: "Cases",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(30)",
                oldMaxLength: 30);
        }
    }
}
