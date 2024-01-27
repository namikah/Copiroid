namespace api_generate.Helper
{
    public static class SqlHelper
	{
        public static string GetSqlType(string csharpType)
        {
            return csharpType switch
            {
                "Int32" => "INTEGER",
                "int" => "INTEGER",
                "String" => "TEXT",
                "string" => "TEXT",
                "bool" => "BOOLEAN",
                "Boolean" => "BOOLEAN",
                _ => "TEXT",
            };
        }

    }
}

