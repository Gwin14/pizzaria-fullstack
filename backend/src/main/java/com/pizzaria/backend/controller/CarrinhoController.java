package com.pizzaria.backend.controller;

import com.pizzaria.backend.model.Carrinho;
import com.pizzaria.backend.model.ItemCarrinho;
import com.pizzaria.backend.repository.CarrinhoRepository;
import com.pizzaria.backend.repository.ItemCarrinhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carrinho")
@CrossOrigin(origins = { "http://localhost:80", "http://localhost:3000" })
public class CarrinhoController {

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Autowired
    private ItemCarrinhoRepository itemCarrinhoRepository;

    // Adicionar item ao carrinho
    @PostMapping
    public ResponseEntity<ItemCarrinho> adicionarItem(
            @RequestBody ItemCarrinho item,
            @RequestParam Long clienteId) {
        // Buscar ou criar carrinho do cliente
        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId).orElse(null);
        if (carrinho == null) {
            carrinho = new Carrinho();
            carrinho.setClienteId(clienteId);
            carrinho = carrinhoRepository.save(carrinho);
        }

        // Associar item ao carrinho
        item.setCarrinho(carrinho);
        ItemCarrinho salvo = itemCarrinhoRepository.save(item);
        return ResponseEntity.ok(salvo);
    }

    // Listar itens de um carrinho
    @GetMapping("/{carrinhoId}")
    public ResponseEntity<List<ItemCarrinho>> listarItens(@PathVariable Long carrinhoId) {
        Carrinho carrinho = carrinhoRepository.findById(carrinhoId).orElse(null);
        if (carrinho == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(carrinho.getItens());
    }

    // Remover item do carrinho
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removerItem(@PathVariable Long itemId) {
        itemCarrinhoRepository.deleteById(itemId);
        return ResponseEntity.noContent().build();
    }

    // Atualizar quantidade/preço de um item
    @PutMapping
    public ResponseEntity<ItemCarrinho> atualizarQuantidade(@RequestBody ItemCarrinho item) {
        Optional<ItemCarrinho> opt = itemCarrinhoRepository.findById(item.getId());
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        ItemCarrinho existente = opt.get();
        existente.setQuantidade(item.getQuantidade());
        existente.setPreco(item.getPreco());

        return ResponseEntity.ok(itemCarrinhoRepository.save(existente));
    }

    // Listar todos os carrinhos
    @GetMapping("")
    public ResponseEntity<List<Carrinho>> listarTodos() {
        return ResponseEntity.ok(carrinhoRepository.findAll());
    }
}
