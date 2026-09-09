using CrimeEvidence.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
<<<<<<< HEAD
using System.Text.Json.Serialization;
=======
>>>>>>> 0b7c4bd (Day 9: Add Docker support, middleware, validation filter and frontend setup)

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers
<<<<<<< HEAD
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
=======
builder.Services.AddControllers();
>>>>>>> 0b7c4bd (Day 9: Add Docker support, middleware, validation filter and frontend setup)

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication
var key = builder.Configuration["Jwt:Key"] ?? "ThisIsADevelopmentSecretKey123456";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

<<<<<<< HEAD
// Middleware Order
app.UseHttpsRedirection();
app.UseCors("Frontend");
=======
app.UseCors("Frontend");

>>>>>>> 0b7c4bd (Day 9: Add Docker support, middleware, validation filter and frontend setup)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();