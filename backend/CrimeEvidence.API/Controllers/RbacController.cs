using CrimeEvidence.API.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrimeEvidence.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RbacController : ControllerBase
{
    [HttpGet("admin")]
    [Authorize(Roles = Roles.Admin)]
    public IActionResult AdminOnly()
    {
        return Ok(new
        {
            message = "Welcome Admin. You have ADMIN access."
        });
    }

    [HttpGet("investigator")]
    [Authorize(Roles = Roles.InvestigatingOfficer)]
    public IActionResult InvestigatorOnly()
    {
        return Ok(new
        {
            message = "Welcome Investigating Officer."
        });
    }

    [HttpGet("evidence")]
    [Authorize(Roles = Roles.EvidenceOfficer)]
    public IActionResult EvidenceOnly()
    {
        return Ok(new
        {
            message = "Welcome Evidence Officer."
        });
    }

    [HttpGet("forensic")]
    [Authorize(Roles = Roles.ForensicOfficer)]
    public IActionResult ForensicOnly()
    {
        return Ok(new
        {
            message = "Welcome Forensic Officer."
        });
    }

    [HttpGet("senior")]
    [Authorize(Roles = Roles.SeniorOfficer)]
    public IActionResult SeniorOfficerOnly()
    {
        return Ok(new
        {
            message = "Welcome Senior Officer."
        });
    }

    
    [HttpGet("senior-admin")]
    [Authorize(Roles = Roles.Admin + "," + Roles.SeniorOfficer)]
    public IActionResult SeniorOrAdmin()
    {
        return Ok(new
        {
            message = "Welcome. You have ADMIN or SENIOR_OFFICER access."
        });
    }
    [HttpGet("sensitive-case")]
[Authorize(Policy = "SensitiveCaseAccess")]
public IActionResult SensitiveCaseAccess()
{
    return Ok(new
    {
        message = "You have access to sensitive case information."
    });
}
}