using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Sockets;

namespace AmySurf.Models.Helpers;

internal sealed class HttpClientHelper
{
    private readonly HttpClient _httpClient;
    private readonly HttpClient _httpClientProxy;
    private readonly IOptions<HttpClientHelperOptions> _httpClientHelperOptions;
    private readonly Dictionary<string, DateTime> _downUriTimeoutTracking = new Dictionary<string, DateTime>();

    public HttpClientHelper(IOptions<HttpClientHelperOptions> options)
    {
        _httpClientHelperOptions = options;
        _httpClient = GetHttpClient(options);
        _httpClientProxy = GetHttpClientProxy(options);
    }

    private static HttpClient GetHttpClient(IOptions<HttpClientHelperOptions> options) =>
        new HttpClient() { Timeout = TimeSpan.FromSeconds(options.Value.TimeOutHttpRequestSec) };

    private static HttpClient GetHttpClientProxy(IOptions<HttpClientHelperOptions> options)
    {
        return string.IsNullOrEmpty(options.Value.WebProxyAddress)
            ? GetHttpClient(options)
            : new HttpClient(new HttpClientHandler()
            {
                Proxy = new WebProxy(options.Value.WebProxyAddress),
                UseProxy = true
            })
            {
                Timeout = TimeSpan.FromSeconds(options.Value.TimeOutHttpRequestSec)
            };
    }

    private async Task<HttpResponseMessage> GetResponseMessageAsyncCore(HttpClient httpClient, Uri uri)
    {
        return await GetResponseAsync(httpClient, uri, TimeSpan.FromSeconds(_httpClientHelperOptions.Value.TimeOutHttpRequestSec)).ConfigureAwait(false);
    }

    // TODO: Refactor?
    public async Task<HttpResponseMessage> GetResponseMessageAsync(Uri uri)
    {
        // Check if Uri down
        var uriKey = GetUriKey(uri.ToString());
        bool isUriDown = IsUriKeyInDownDictionary(uriKey);
        if (isUriDown)
            throw new InvalidOperationException("Uri is still down, try later");

        // Test if proxy is know as down
        bool isProxyOff;
        string proxyUriKey = string.Empty;
        if (_httpClientHelperOptions.Value.WebProxyAddress.Length == 0)
        {
            isProxyOff = true;
        }
        else
        {
            proxyUriKey = GetUriKey(_httpClientHelperOptions.Value.WebProxyAddress);
            isProxyOff = IsUriKeyInDownDictionary(proxyUriKey);
        }

        HttpResponseMessage response;
        List<Exception> exceptions = new List<Exception>();

        if (!isProxyOff)
        {
            try
            {
                response = await GetResponseMessageAsyncCore(_httpClientProxy, uri).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    // Console.WriteLine("INFORMATION: OK Proxy connection used");
                    return response;
                }
                else
                {
                    TrackDownUri(proxyUriKey);
                    // Console.WriteLine($"ERROR: Can't reach the proxy : {_httpClientHelperOptions.Value.WebProxyAddress}");
                }
            }
            catch (Exception e)
            {
                TrackDownUri(proxyUriKey);
                exceptions.Add(e);
            }
        }

        try
        {
            response = await GetResponseMessageAsyncCore(_httpClient, uri).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                // Console.WriteLine("INFORMATION: OK Direct connection used");
                return response;
            }
            else
            {
                TrackDownUri(uriKey);
                // Console.WriteLine("INFORMATION: Error With Direct connection used");
            }
        }
        catch (Exception e)
        {
            TrackDownUri(uriKey);
            exceptions.Add(e);
            throw new AggregateException(exceptions);
        }

        if (response.Content is null)
        {
            exceptions.Add(new InvalidOperationException("Response Content is missing"));
            throw new AggregateException(exceptions);
        }
        return response.EnsureSuccessStatusCode();
    }

    //public async Task<HttpResponseMessage> GetResponseMessageAsyncOld(Uri uri)
    //{
    //    // Check if Uri know as down
    //    var uriKey = GetUriKey(uri.ToString());
    //    bool isUriDown = IsUriKeyInDownDictionary(uriKey);
    //    if (isUriDown)
    //        return new HttpResponseMessage(HttpStatusCode.NotFound);

    //    // Test if proxy is know as down
    //    bool isProxyOff;
    //    string proxyUriKey = string.Empty;
    //    if (_httpClientHelperOptions.Value.WebProxyAddress.Length == 0)
    //    {
    //        isProxyOff = true;
    //    }
    //    else
    //    {
    //        proxyUriKey = GetUriKey(_httpClientHelperOptions.Value.WebProxyAddress);
    //        isProxyOff = IsUriKeyInDownDictionary(proxyUriKey);
    //    }

    //    if (!isProxyOff)
    //    {
    //        HttpResponseMessage response = await GetResponseMessageAsync(_httpClientProxy, uri).ConfigureAwait(false);
    //        if (response.IsSuccessStatusCode)
    //        {
    //            Console.WriteLine("INFORMATION: OK Proxy connection used");
    //            return response;
    //        }
    //        else
    //        {
    //            TrackDownUri(proxyUriKey);
    //            Console.WriteLine($"ERROR: Can't reach the proxy : {_httpClientHelperOptions.Value.WebProxyAddress}");
    //        }
    //    }

    //    HttpResponseMessage r = await GetResponseMessageAsync(_httpClient, uri).ConfigureAwait(false);
    //    if (r.IsSuccessStatusCode)
    //    {
    //        Console.WriteLine("INFORMATION: OK Direct connection used");
    //    }
    //    else
    //    {
    //        TrackDownUri(uriKey);
    //        Console.WriteLine("INFORMATION: Error With Direct connection used");
    //    }

    //    return r;
    //}

    private async Task<HttpResponseMessage> GetResponseAsync(HttpClient httpClient, Uri uri, TimeSpan timeout)
    {
        using CancellationTokenSource? cts = new CancellationTokenSource(timeout);
        // Console.WriteLine($"INFORMATION: Get Uri is : {uri}");
        Task<HttpResponseMessage>? getTask = httpClient.GetAsync(uri, cts.Token);
        Task? timeoutTask = Task.Delay(timeout);
        Task? task = await Task.WhenAny(getTask, timeoutTask).ConfigureAwait(false);
        return task == getTask ? await getTask.ConfigureAwait(false) : new HttpResponseMessage(HttpStatusCode.NotFound);
    }

    public async Task<HttpResponseMessage> GetResponseMessageAsyncOLD(Uri uri)
    {
        //Test if uri is working
        if (!await IsUriHealthy(uri.ToString()).ConfigureAwait(false))
        {
            // Console.WriteLine($"ERROR: Url not Healthy :{uri}");
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        //Test if proxy is working
        bool isProxyOFF = _httpClientHelperOptions.Value.WebProxyAddress.Length == 0 || !await IsUriHealthy(_httpClientHelperOptions.Value.WebProxyAddress).ConfigureAwait(false);

        if (!isProxyOFF)
        {
            HttpResponseMessage response = await GetResponseMessageAsyncCore(_httpClientProxy, uri).ConfigureAwait(false);
            if (response.IsSuccessStatusCode)
            {
                // Console.WriteLine("INFORMATION: OK Proxy connection used");
                return response;
            }

            // Console.WriteLine($"ERROR: Can't reach the proxy : {_httpClientHelperOptions.Value.WebProxyAddress}");
        }

        HttpResponseMessage r = await GetResponseMessageAsyncCore(_httpClient, uri).ConfigureAwait(false);
        //if (r.IsSuccessStatusCode)
        //    Console.WriteLine("INFORMATION: OK Direct connection used");
        //else
        //    Console.WriteLine("INFORMATION: Error With Direct connection used");
        return r;
    }

    private async Task<bool> IsUriHealthy(string uri)
    {
        string uriKey = GetUriKey(uri);

        if (IsUriKeyInDownDictionary(uriKey))
            return false;

        TimeSpan timeout = TimeSpan.FromSeconds(_httpClientHelperOptions.Value.TimeOutHttpRequestSec);
        Task? timeoutTask = Task.Delay(timeout);

        string[]? address = uri.Split('/')[2].Split(':');
        string? host = address[0];
        int port = address.Length > 1 ? int.Parse(address[1]) : 443;

        using TcpClient? client = new TcpClient();
        Task? connectTask = client.ConnectAsync(host, port);

        Task? task = await Task.WhenAny(connectTask, timeoutTask).ConfigureAwait(false);

        if (task == timeoutTask)
        {
            TrackDownUri(uriKey);
            return false;
        }

        try
        {
            await connectTask.ConfigureAwait(false);
            return true;
        }
        catch
        {
            TrackDownUri(uriKey);
            return false;
        }
    }

    private void TrackDownUri(string uriKey)
    {
        lock (_downUriTimeoutTracking)
        {
            _downUriTimeoutTracking.TryAdd(uriKey, DateTime.UtcNow);
        }
    }

    /// <summary>
    /// Its down when : Key exist in dictionary and is younger than X sec
    /// It delete Key if old
    /// </summary>
    /// <param name="uriKey"></param>
    private bool IsUriKeyInDownDictionary(string uriKey)
    {
        lock (_downUriTimeoutTracking)
        {
            bool isInDictionary = _downUriTimeoutTracking.TryGetValue(uriKey, out DateTime uriDateTimeDown);
            if (!isInDictionary)
                return false;

            TimeSpan ageOfEntry = DateTime.UtcNow - uriDateTimeDown;
            if (ageOfEntry >= new TimeSpan(0, 0, _httpClientHelperOptions.Value.TimeBeforeRetryUriSec))
            {
                _downUriTimeoutTracking.Remove(uriKey);
                return false;
            }

            return true;
        }
    }

    // "https:api.WebSite.org"
    private static string GetUriKey(string uri)
    {
        string uriKey;
        try
        {
            string[] uriSplit = uri.Split('/');
            uriKey = string.Concat(uriSplit[0], uriSplit[1], uriSplit[2]);
        }
        catch (Exception)
        {
            throw new InvalidOperationException($"Error while creating Key on Uri : {uri}");
        }

        return uriKey.Length == 0 ? throw new InvalidOperationException($"Error while creating Key on Uri : {uri}") : uriKey;
    }
}

public sealed class HttpClientHelperOptions
{
    // "http://127.0.0.1:9070/"
    // "http://10.0.2.2:9070/" for Android
    public string WebProxyAddress { get; set; } = string.Empty;
    public int TimeOutHttpRequestSec { get; set; }
    public int TimeBeforeRetryUriSec { get; set; }
}
