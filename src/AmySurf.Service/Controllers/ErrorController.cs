using AmySurf.Service.Logging;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AmySurf.Service.Controllers;

[ApiController]
public sealed class ErrorController : ControllerBase
{
    private readonly ILogger _logger;

    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }

    [Route("/error")]
    public IActionResult Error()
    {
        var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

        Log.ApiControllerError(_logger, context?.Error.Message ?? "Error message is missing");

        return Problem(title: context?.Error.Message);
    }
}
