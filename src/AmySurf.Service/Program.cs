using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace AmySurf.Service;

public sealed class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddJsonConsole(c =>
                {
                    c.IncludeScopes = true;
                    c.TimestampFormat = "o";
                    c.JsonWriterOptions = new JsonWriterOptions
                    {
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };
                });
            })
            //.ConfigureAppConfiguration((hostingContext, config) =>
            //{
            //    config.AddCommandLine(args);
            //})
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
                // Use EnvVar ASPNETCORE_URLS
                //.UseUrls("http://0.0.0.0:5000");
            });
}
