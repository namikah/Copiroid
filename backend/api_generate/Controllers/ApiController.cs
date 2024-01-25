using System.Dynamic;
using System.Text;
using System.Text.Json.Nodes;
using api_generate.Context;
using api_generate.Helper;
using api_generate.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;

namespace api_generate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApiController(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpPost("Create")]
        public IActionResult GenerateApi([FromQuery] string tableName, [FromBody] List<Parameter> parameters)
        {
            if (_context.Database.GetPendingMigrations().Any())
            {
                _context.Database.Migrate();
            }

            try
            {
                var tableExists = _context.Tables.FromSqlRaw($"SELECT name FROM sqlite_master WHERE type='table' AND name='{tableName}'").Any();

                if (!tableExists)
                {
                    var createTableQuery = $"CREATE TABLE {tableName} (Id INTEGER PRIMARY KEY, ";

                    foreach (var property in parameters)
                    {
                        var propertyName = property.Name;
                        var propertyType = property.Type;

                        createTableQuery += $"{propertyName} {propertyType}, ";
                    }

                    createTableQuery = createTableQuery.TrimEnd(',', ' ') + ");";

                    _context.Database.ExecuteSqlRaw(createTableQuery);
                }
                else
                {
                    foreach (var property in parameters)
                    {
                        var propertyName = property.Name;
                        var propertyType = property.Type;

                        var addColumnQuery = $"ALTER TABLE {tableName} ADD COLUMN {propertyName} {propertyType};";

                        _context.Database.ExecuteSqlRaw(addColumnQuery);
                    }
                }

                var endpointUrl = $"/api/get/{tableName}";

                return Ok($"https://localhost:4567{endpointUrl}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("Add")]
        public IActionResult AddToTable([FromQuery] string tableName, Dictionary<string, string> keyValues)
        {

            try
            {
                var keys = "";
                var values = "";

                foreach (var item in keyValues)
                {
                    keys += item.Key + ",";
                    values += "'" + item.Value + "',";
                }
                keys = keys.TrimEnd(',');
                values = values.TrimEnd(',');

                _context.Database.ExecuteSqlRaw($"INSERT INTO {tableName} ({keys}) VALUES ({values});");

                var endpointUrl = $"/api/get/{tableName}";

                return Ok($"https://localhost:4567{endpointUrl}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("Get/{tableName}")]
        public IActionResult GetApi(string tableName)
        {
            try
            {
                var tableExists = _context.Tables.FromSqlRaw($"SELECT name FROM sqlite_master WHERE type='table' AND name='{tableName}'").Any();
                if (!tableExists)
                {
                    return NotFound($"Table '{tableName}' not found.");
                }

                //var data = _context.Set<object>().FromSqlRaw($"SELECT * FROM {tableName};").ToList();
                var data = ExecuteSqlQuery($"SELECT * FROM {tableName}");


                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("GetAllTableNames")]
        public IActionResult GetAllTableNames()
        {
            try
            {
                var tableNames = _context
                    .Tables
                    .FromSqlRaw("SELECT name FROM sqlite_master WHERE type='table'")
                    .Select(table => table.Name)
                    .ToList();

                if (tableNames.Count <= 0)
                {
                    return NotFound("No tables found.");
                }

                return Ok(tableNames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("GetProperties/{tableName}")]
        public IActionResult GetTableProperties(string tableName)
        {
            try
            {
                var connectionString = _context.Database.GetConnectionString();

                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Open();

                    var properties = new List<object>();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = $"PRAGMA table_info({tableName});";

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var propertyName = reader.GetString(reader.GetOrdinal("name"));
                                var propertyType = reader.GetString(reader.GetOrdinal("type"));

                                properties.Add(new { Name = propertyName, Type = propertyType });
                            }
                        }
                    }

                    if (properties.Count == 0)
                    {
                        return NotFound($"Table '{tableName}' not found or has no properties.");
                    }

                    return Ok(new { TableName = tableName, Properties = properties });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

        }


        private List<dynamic> ExecuteSqlQuery(string sql)
        {
            using (var connection = _context.Database.GetDbConnection())
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = sql;
                    using (var reader = command.ExecuteReader())
                    {
                        var data = new List<dynamic>();
                        while (reader.Read())
                        {
                            var rowData = new ExpandoObject() as IDictionary<string, object>;
                            for (var i = 0; i < reader.FieldCount; i++)
                            {
                                rowData.Add(reader.GetName(i), reader[i]);
                            }
                            data.Add(rowData);
                        }
                        return data;
                    }
                }
            }
        }

    }

}