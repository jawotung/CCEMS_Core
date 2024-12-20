﻿using Application.Contracts.Services;
using Application.Models.DTOs.Report;
using Application.Models.Helpers;
using Application.Models.Responses;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReportDetailsController : ControllerBase
    {
        private readonly IReportDetailsService _service;
        public ReportDetailsController(IReportDetailsService service) 
        {
            _service = service;
        }
        [HttpGet("GetList")]
        public async Task<IActionResult> GetList(int id , int page)
        {
            try
            {
                return Ok(await _service.GetReportContentsList(id,page));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("GetReport")]
        public async Task<IActionResult> GetReport(int id)
        {
            try
            {
                return Ok(await _service.GetReport(id));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("SelectedBranches")]
        public async Task<IActionResult> SelectedBranches(int id)
        {
            try
            {
                return Ok(await _service.SelectedBranches(id));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost("GetBranchNames")]
        public async Task<IActionResult> GetBranchNames(Report report)
        {
            try
            {
                return Ok(await _service.GetBranchNames(report));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("PopulateBranchRecipients")]
        public async Task<IActionResult> PopulateBranchRecipients(string selected = "", string brCode = "")
        {
            try
            {
                return Ok(await _service.PopulateBranchRecipients(selected, brCode));
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("PulloutRequest")]
        public async Task<IActionResult> PulloutRequest(int id, string refno)
        {
            try
            {
                var result = await _service.PulloutRequest(id, refno);
                if (result.Success)
                    return File(result.Data.FileByte, result.Data.ContentType, result.Data.FileName);
                else
                    return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("ExportDataFromDetails")]
        public async Task<IActionResult> ExportDataFromDetails(int id)
        {
            try
            {
                var result = await _service.ExportDataFromDetails(id);
                if (result.Success)
                    return File(result.Data.FileByte, result.Data.ContentType, result.Data.FileName);
                else
                    return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost("Reject")]
        public async Task<IActionResult> Reject(int id, Guid reportsGuid, string remarks)
        {
            try
            {
                var result = await _service.Reject(id, reportsGuid, remarks);
                return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost("Approve")]
        public async Task<IActionResult> Approve(int id, Guid reportsGuid)
        {
            try
            {
                var result = await _service.Approve(id, reportsGuid);
                return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost("SendReport")]
        public async Task<IActionResult> SendReport(SendRequestDTO data)
        {
            try
            {
                var result = await _service.SendReport(data.ToList, data.CCList, data.id);
                return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}