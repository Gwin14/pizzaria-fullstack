package com.pizzaria.backend.repository;

import com.pizzaria.backend.model.Carrinho;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {
    Optional<Carrinho> findByClienteId(Long clienteId);
}
