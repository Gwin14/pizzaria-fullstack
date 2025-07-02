package com.pizzaria.backend.controller;

import com.pizzaria.backend.model.*;
import com.pizzaria.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = { "http://localhost:80", "http://localhost:3000" })
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private CarrinhoRepository carrinhoRepository;
    @Autowired
    private ItemCarrinhoRepository itemCarrinhoRepository;
    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    // Finalizar pedido: transforma carrinho em pedido
    @PostMapping
    public ResponseEntity<Pedido> finalizar(
            @RequestParam Long clienteId,
            @RequestParam Long carrinhoId) {
        try {
            Cliente cliente = clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            Carrinho carrinho = carrinhoRepository.findById(carrinhoId)
                    .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

            if (carrinho.getItens().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            Pedido pedido = new Pedido();
            pedido.setCliente(cliente);
            pedido.setData(LocalDateTime.now());
            pedido.setStatus("PENDENTE");

            // Copia itens do carrinho para o pedido
            List<ItemPedido> itensPedido = carrinho.getItens().stream()
                    .map(itemCarrinho -> {
                        ItemPedido ip = new ItemPedido();
                        ip.setPedido(pedido);
                        ip.setPizzaId(itemCarrinho.getPizzaId());
                        ip.setQuantidade(itemCarrinho.getQuantidade());
                        ip.setPreco(itemCarrinho.getPreco());
                        return ip;
                    }).collect(Collectors.toList());

            pedido.setItens(itensPedido);
            Pedido pedidoSalvo = pedidoRepository.save(pedido);

            // Limpa o carrinho
            itemCarrinhoRepository.deleteAll(carrinho.getItens());

            return new ResponseEntity<>(pedidoSalvo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Listar pedidos por cliente (GET com parâmetro clienteId)
    @GetMapping
    public ResponseEntity<List<Pedido>> getByCliente(@RequestParam Long clienteId) {
        try {
            if (!clienteRepository.existsById(clienteId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            List<Pedido> pedidos = pedidoRepository.findByClienteId(clienteId);
            return new ResponseEntity<>(pedidos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Listar todos os pedidos (para admin)
    @GetMapping("/all")
    public ResponseEntity<List<Pedido>> getAll() {
        try {
            List<Pedido> pedidos = pedidoRepository.findAll();
            return new ResponseEntity<>(pedidos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Buscar pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getById(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar status do pedido
    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            return pedidoRepository.findById(id)
                    .map(pedido -> {
                        pedido.setStatus(status);
                        Pedido updatedPedido = pedidoRepository.save(pedido);
                        return new ResponseEntity<>(updatedPedido, HttpStatus.OK);
                    })
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}