var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers(); // ✅ Register controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // ✅ Serve uploaded files if needed

app.UseAuthorization();

app.MapControllers(); // ✅ Map controller routes

app.Run();
