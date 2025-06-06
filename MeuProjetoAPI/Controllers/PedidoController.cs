﻿using MeuProjetoAPI.DTO;
using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using MeuProjetoAPI.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MeuProjetoAPI.Model.ProdutoModel;

namespace MeuProjetoAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PedidoController : ControllerBase
{
    private readonly SiteDbContext _context;

    public PedidoController(SiteDbContext context)
    {
        _context = context;
    }

    [HttpPost("Pedido")]
    public async Task<IActionResult> Create([FromBody] PedidoModel pedidoModel)
    {
        if (pedidoModel == null)
            return BadRequest("Dados do produto inválidos.");

        var pedido = new PedidoEntidade
        {
            StatusPedido = pedidoModel.Status,
            DataPedido = pedidoModel.DatePedido,
            ValorTotal = pedidoModel.VlTotal 
        };

        _context.Pedido.Add(pedido);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Create), new { id = pedido.Id }, pedido);
    }

    [HttpGet]
    [Route("ListarPedidos")]
    public async Task<List<PedidoEntidade>> List()
    {
        using var context = new SiteDbContext();

        return await context.Pedido.ToListAsync();
    }

    [HttpPut("AlterarStatus/{pedidoId}")]
    public async Task<IActionResult> AlterarStatusPedido(int pedidoId, [FromBody] AtualizarStatusPedidoModel statusPedidoModel)
    {
        var pedido = await _context.Pedido.FindAsync(pedidoId);

        if (pedido == null)
            return NotFound("Pedido não encontrado.");

        pedido.StatusPedido = statusPedidoModel.Status; // Atualiza o status do pedido

        _context.Pedido.Update(pedido);
        await _context.SaveChangesAsync();

        return Ok(pedido); // Retorna o pedido atualizado
    }

}