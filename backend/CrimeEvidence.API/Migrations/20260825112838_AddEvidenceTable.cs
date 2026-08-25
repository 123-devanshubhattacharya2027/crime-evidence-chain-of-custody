using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrimeEvidence.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEvidenceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Evidence",
                table: "Evidence");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Evidence");

            migrationBuilder.DropColumn(
                name: "CurrentLocation",
                table: "Evidence");

            migrationBuilder.DropColumn(
                name: "SealNumber",
                table: "Evidence");

            migrationBuilder.RenameTable(
                name: "Evidence",
                newName: "Evidences");

            migrationBuilder.RenameColumn(
                name: "FoundLocation",
                table: "Evidences",
                newName: "StorageLocation");

            migrationBuilder.RenameColumn(
                name: "EvidenceType",
                table: "Evidences",
                newName: "CollectedBy");

            migrationBuilder.RenameColumn(
                name: "EvidenceId",
                table: "Evidences",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "EvidenceNumber",
                table: "Evidences",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Evidences",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Evidences",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Evidences",
                table: "Evidences",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Evidences_CaseId",
                table: "Evidences",
                column: "CaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Evidences_Cases_CaseId",
                table: "Evidences",
                column: "CaseId",
                principalTable: "Cases",
                principalColumn: "CaseId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evidences_Cases_CaseId",
                table: "Evidences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Evidences",
                table: "Evidences");

            migrationBuilder.DropIndex(
                name: "IX_Evidences_CaseId",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Evidences");

            migrationBuilder.RenameTable(
                name: "Evidences",
                newName: "Evidence");

            migrationBuilder.RenameColumn(
                name: "StorageLocation",
                table: "Evidence",
                newName: "FoundLocation");

            migrationBuilder.RenameColumn(
                name: "CollectedBy",
                table: "Evidence",
                newName: "EvidenceType");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Evidence",
                newName: "EvidenceId");

            migrationBuilder.AlterColumn<string>(
                name: "EvidenceNumber",
                table: "Evidence",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Evidence",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CurrentLocation",
                table: "Evidence",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SealNumber",
                table: "Evidence",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Evidence",
                table: "Evidence",
                column: "EvidenceId");
        }
    }
}
