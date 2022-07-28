using AmySurf.Helpers;
using AmySurf.Models;
using AmySurf.Providers;
using AmySurf.Providers.External;
using AmySurf.Services;
using CompressedStaticFiles;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AmySurf.Service;

public sealed class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        if (!_configuration.GetValue<bool>("DisableBackgroundService", false))
            services.AddHostedService<ForecastBackgroundService>();
        services.Configure<ForecastBackgroundServiceOptions>(_configuration);
        services.AddSingleton<SpotProvider>();
        services.AddSingleton<HttpClientHelper>();
        services.Configure<HttpClientHelperOptions>(_configuration.GetSection("HttpClient"));
        services.AddSingleton<IForecastStore, FileSystemForecastStore>();

        services.AddCompressedStaticFiles();

        services.AddCors(options => options.AddPolicy("no-cors", builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()));

        services.Configure<FileSystemForecastStoreOptions>(_configuration);

        services.AddSingleton<OnlineForecastProvider>();

        services.AddSingleton<IForecastProvider>(services =>
        {
            var store = services.GetRequiredService<IForecastStore>();
            var provider = new CachedForecastProvider(new LockedForecastProvider(store));
            return provider;
        });

        services.AddSingleton<ISurfForecastProvider, SurflineProvider>();
        services.AddSingleton<IWeatherForecastsProvider, OpenWeatherMapProvider>();
        services.AddSingleton<IEnergyForecastsProvider, SurfForecastDotComProvider>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
            app.UseDeveloperExceptionPage();
        else
            app.UseExceptionHandler("/error");

        app.UseCors("no-cors");
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapFallbackToFile("/index.html");
        });
        app.UseDefaultFiles();
        app.UseCompressedStaticFiles();
    }
}
