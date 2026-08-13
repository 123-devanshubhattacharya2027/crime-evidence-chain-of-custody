using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrimeEvidence.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    // Anyone with a valid JWT
    [HttpGet("protected")]
    [Authorize]
    public IActionResult Protected()
    {
        return Ok(new
        {
            message = "JWT authentication is working!",
            user = User.Identity?.Name,
            role = User.FindFirst(
                System.Security.Claims.ClaimTypes.Role
            )?.Value
        });
    }

    
    [HttpGet("admin")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult AdminOnly()
    {
        return Ok(new
        {
            message = "You are an ADMIN.",
            role = User.FindFirst(
                System.Security.Claims.ClaimTypes.Role
            )?.Value
        });
    }

  
    [HttpGet("investigator")]
    [Authorize(Roles = "INVESTIGATING_OFFICER")]
    public IActionResult InvestigatorOnly()
    {
        return Ok(new
        {
            message = "You are an Investigating Officer.",
            role = User.FindFirst(
                System.Security.Claims.ClaimTypes.Role
            )?.Value
        });
    }

    
    [HttpGet("senior-access")]
    [Authorize(Roles = "ADMIN,SENIOR_OFFICER")]
    public IActionResult AdminOrSenior()
    {
        return Ok(new
        {
            message = "You are an ADMIN or SENIOR_OFFICER.",
            role = User.FindFirst(
                System.Security.Claims.ClaimTypes.Role
            )?.Value
        });
    }
}