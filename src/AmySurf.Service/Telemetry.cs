// using System.Diagnostics.Metrics;
// using Microsoft.AspNetCore.Builder;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.DependencyInjection;
// using OpenTelemetry.Metrics;
// using OpenTelemetry.Trace;
// namespace AmySurf;

// public static class Telemetry
// {
//     private const string CounterPrefix = "amysurf";

//     public static Meter Meter { get; } = new Meter("AmySurf");

//     // https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md
//     public static void AddTelemetryExporter(this IServiceCollection services, IConfiguration configuration)
//     {
//         services.AddOpenTelemetryMetrics(b =>
//         {
//             // Instrumentation
//             b.AddMeter("AmySurf");
//             b.AddAspNetCoreInstrumentation();
//             b.AddHttpClientInstrumentation();

//             // Exporter
//             b.AddPrometheusExporter(options =>
//             {
//                 options.StartHttpListener = true;
//                 options.HttpListenerPrefixes = new string[] { $"http://localhost:{configuration.GetValue<int>("MetricsPort", 19464)}/" };
//                 options.ScrapeResponseCacheDurationMilliseconds = 0;
//             });
//         });
//     }

//     public static void UseWalletServiceTelemetry(this IApplicationBuilder app)
//     {
//         // // Connection count
//         // Telemetry.Meter.CreateObservableGauge<int>(
//         //     name: CounterPrefix + "_connections",
//         //     description: "Active Connections",
//         //     observeValue: () => 6);

//         // TODO: might be needed to chande defaut port
//         // app.UseOpenTelemetryPrometheusScrapingEndpoint(
//         //     context => context.Request.Path == "/internal/metrics" && context.Connection.LocalPort == 5067);

//     }
// }