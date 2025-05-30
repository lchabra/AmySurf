using AmySurf.Helpers;
using AmySurf.Models;
using AmySurf.Providers;
using AmySurf.Service;
using AmySurf.Services;
using AmySurf.Tests.Providers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using Xunit;

namespace AmySurf.Tests;

public sealed class ForecastProviderTest
{
    [Fact]
    public async Task TestLockOnRWHelper()
    {
        var startupArgs = new string[] { "PollingInterval=00:00:00.004" };
        var localHost = CreateHostBuilderTest(startupArgs).Build();
        await localHost.StartAsync();

        GetForecastRequest getForecastRequest = GetForecastRequest();
        LockedForecastProvider offlineForecastProvider = localHost.Services.GetRequiredService<LockedForecastProvider>();

        // Surf
        GetSurfForecastResponse getSurfForecastResponse = await offlineForecastProvider.GetSurfForecastAsync(getForecastRequest);
        int count = 0;
        IEnumerable<Task<GetSurfForecastResponse>> surfTasks = Enumerable.Range(1, 1500).Select(_ =>
        {
            Debug.WriteLine("Information: Request to API Started " + count);
            count++;
            return offlineForecastProvider.GetSurfForecastAsync(getForecastRequest);
        }).ToArray();
        _ = await Task.WhenAll(surfTasks);
        foreach (var task in surfTasks)
        {
            Assert.True(task.IsCompletedSuccessfully);
        }

        // Weather
        GetWeatherForecastResponse getWeatherForecastResponse = await offlineForecastProvider.GetWeatherForecastAsync(getForecastRequest);
        int countWeather = 0;
        IEnumerable<Task<GetWeatherForecastResponse>> weatherTasks = Enumerable.Range(1, 1500).Select(_ =>
        {
            Debug.WriteLine("Information: Request to API Started " + countWeather);
            countWeather++;
            return offlineForecastProvider.GetWeatherForecastAsync(getForecastRequest);
        }).ToArray();
        _ = await Task.WhenAll(weatherTasks);
        foreach (var task in weatherTasks)
        {
            Assert.True(task.IsCompletedSuccessfully);
        }

        // Energy
        GetEnergyForecastResponse getEnergyForecastResponse = await offlineForecastProvider.GetEnergyForecastAsync(getForecastRequest);
        int countEnergy = 0;
        IEnumerable<Task<GetEnergyForecastResponse>> energyTasks = Enumerable.Range(1, 1500).Select(_ =>
         {
             Debug.WriteLine("Information: Request to API Started " + countEnergy);
             countEnergy++;
             return offlineForecastProvider.GetEnergyForecastAsync(getForecastRequest);
         }).ToArray();
        _ = await Task.WhenAll(energyTasks);
        foreach (var task in energyTasks)
        {
            Assert.True(task.IsCompletedSuccessfully);
        }
        await localHost.StopAsync();
    }

    // A Client is making a lot of requests
    [Fact]
    public async Task StressApiServiceForecast()
    {
        // Start Worker-Api Service
        var startupArgs = new string[0];
        var localHost = CreateHostBuilderTest(startupArgs).Build();
        await localHost.StartAsync();

        GetForecastRequest getForecastRequest = GetForecastRequest();

        // Use the ForecastProviderApiClient, which will internally use TestForecastProvider
        ForecastProviderApiClient clientApiProvider = GetForecastProviderApiClient("http://localhost:5002");

        int count = 0;
        IEnumerable<Task<GetSurfForecastResponse>> tasks = Enumerable.Range(1, 1000).Select(_ =>
        {
            Debug.WriteLine("Information: Request to API Started " + count);
            count++;
            return clientApiProvider.GetSurfForecastAsync(getForecastRequest);
        }).ToArray();

        var responses = await Task.WhenAll(tasks);

        foreach (var task in tasks)
        {
            Assert.True(task.IsCompletedSuccessfully);
            if (!task.IsCompletedSuccessfully)
            {
                Debug.WriteLine("Information: A task had failed :");
                // +task.Exception
            }
        }
        await localHost.StopAsync();
    }

    private static GetForecastRequest GetForecastRequest()
    {
        DateTime startTime = DateTime.UtcNow.Date - TimeSpan.FromHours(48);
        DateTime endTime = DateTime.UtcNow.Date + TimeSpan.FromHours(48);
        return (GetForecastRequest)(new("IdTest", startTime, endTime));
    }

    private static ForecastProviderApiClient GetForecastProviderApiClient(string localServerAddress)
    {
        HttpClientHelperOptions httpOptions = new()
        {
            RetryInterval = TimeSpan.FromSeconds(60),
            Timeout = TimeSpan.FromSeconds(10),
            WebProxyAddress = string.Empty
        };
        HttpClientHelper httpClientHelper = new(Options.Create(httpOptions));
        var o = Options.Create<ForecastProviderApiClientOptions>(new ForecastProviderApiClientOptions() { Server = localServerAddress });
        return new ForecastProviderApiClient(httpClientHelper, o);
    }

    private static IHostBuilder CreateHostBuilderTestOld(string[] args)
    {
        return Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(
            webBuilder => webBuilder.UseStartup<Startup>()
            .ConfigureServices(serviceCollection =>
            {
                ServiceDescriptor sd = serviceCollection.First(s => s.ImplementationFactory?.Method?.DeclaringType?.FullName?.Contains("AmySurf") == true);
                serviceCollection.Remove(sd);

                serviceCollection.AddHostedService<ForecastBackgroundService>(serviceProvider =>
                {
                    return ActivatorUtilities.CreateInstance<ForecastBackgroundService>(serviceProvider, new TestForecastProvider());
                });
            }).UseUrls("http://0.0.0.0:5000"));
    }

    private static IHostBuilder CreateHostBuilderTest(string[] args)
    {
        return Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(
            webBuilder => webBuilder.UseStartup<Startup>()
            .ConfigureServices(serviceCollection =>
            {
                // Remove the existing service descriptor for the forecast provider
                ServiceDescriptor sd = serviceCollection.First(s => s.ImplementationFactory?.Method?.DeclaringType?.FullName?.Contains("AmySurf") == true);
                serviceCollection.Remove(sd);

                // Register TestForecastProvider as the implementation of IForecastProvider
                serviceCollection.AddSingleton<IForecastProvider, TestForecastProvider>();

                // Register LockedForecastProvider, which will use TestForecastProvider internally
                serviceCollection.AddSingleton<LockedForecastProvider>();

                // Disable ForecastBackgroundService to prevent online data fetching
                serviceCollection.Remove(
                    serviceCollection.First(s => s.ServiceType == typeof(IHostedService) &&
                                                          s.ImplementationType == typeof(ForecastBackgroundService)));

            }).UseUrls("http://0.0.0.0:5002"));
    }
}