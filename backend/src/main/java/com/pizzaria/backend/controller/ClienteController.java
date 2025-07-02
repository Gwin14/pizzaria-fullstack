package com.pizzaria.backend.controller;

import com.pizzaria.backend.model.Cliente;
import com.pizzaria.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = { "http://localhost:80", "http://localhost:3000" }) // Permite acesso do front
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    // Criar novo cliente
    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        Cliente salvo = clienteRepository.save(cliente);
        return ResponseEntity.ok(salvo);
    }

    // Listar todos os clientes
    @GetMapping("")
    public ResponseEntity<List<Cliente>> listarTodos() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    // Login do cliente (por e-mail)
    @PostMapping("/login")
    public ResponseEntity<Cliente> login(@RequestBody Cliente dadosLogin) {
        String email = dadosLogin.getEmail();

        Cliente cliente = clienteRepository.findByEmail(email);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
