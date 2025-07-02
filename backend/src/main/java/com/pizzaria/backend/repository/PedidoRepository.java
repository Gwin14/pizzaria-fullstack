package com.pizzaria.backend.repository;

import com.pizzaria.backend.model.Carrinho;
import com.pizzaria.backend.model.Pedido;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteId(Long clienteId);

}
