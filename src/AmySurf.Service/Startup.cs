using AmySurf.Models;
using AmySurf.Models.Helpers;
using AmySurf.Providers;
using AmySurf.Providers.Helpers;
using CompressedStaticFiles;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace AmySurf.Service
{
    public class Startup
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
            services.AddHostedService<ForecastWorkerBackgroundService>(s =>
            {
                var p = s.GetRequiredService<OnlineForecastProvider>();
                return ActivatorUtilities.CreateInstance<ForecastWorkerBackgroundService>(s, p);
            });
            services.Configure<ForecastWorkerBackgroundServiceOptions>(_configuration);
            services.AddSingleton<SpotProvider>();
            services.AddSingleton<HttpClientHelper>();
            services.Configure<HttpClientHelperOptions>(_configuration);
            services.AddSingleton<ForecastRWHelper>();

            services.AddCompressedStaticFiles();

            services.AddCors(options => options.AddPolicy("no-cors", builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()));

            services.Configure<ForecastRWOptions>(_configuration);

            //services.Configure<ForecastRWOptions>(
            //    o => o.BaseDataDirectory = Environment.GetEnvironmentVariable("BASEDATADIRECTORY") ?? "Default Home");

            services.AddSingleton<OnlineForecastProvider>();
            services.AddSingleton<OfflineForecastProvider>();
            services.AddSingleton<CacheForecastProvider>();

            //services.AddSingleton<IForecastsProvider>(services =>
            //{
            //    OfflineForecastProvider p1 = services.GetRequiredService<OfflineForecastProvider>();
            //    //OnlineForecastProvider p2 = services.GetRequiredService<OnlineForecastProvider>();
            //    return new MultiForecastProvider(services.GetRequiredService<SpotProvider>(), p1);
            //});

            services.AddSingleton<IForecastsProvider>(services =>
            {
                OfflineForecastProvider p1 = services.GetRequiredService<OfflineForecastProvider>();
                return new CacheForecastProvider(services.GetRequiredService<SpotProvider>(), new MultiForecastProvider(services.GetRequiredService<SpotProvider>(), p1));
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
}
