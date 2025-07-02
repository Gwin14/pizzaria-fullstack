package com.pizzaria.backend.controller;

import com.pizzaria.backend.model.Pizza;
import com.pizzaria.backend.repository.PizzaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pizzas")
@CrossOrigin(origins = { "http://localhost:80", "http://localhost:3000" })
public class PizzaController {

    @Autowired
    private PizzaRepository pizzaRepository;

    // Get all pizzas
    @GetMapping
    public ResponseEntity<List<Pizza>> getAllPizzas() {
        try {
            List<Pizza> pizzas = pizzaRepository.findAll();
            return new ResponseEntity<>(pizzas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get pizza by ID
    @GetMapping("/{id}")
    public ResponseEntity<Pizza> getPizzaById(@PathVariable Long id) {
        return pizzaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new pizza
    @PostMapping
    public ResponseEntity<Pizza> createPizza(@RequestBody Pizza pizza) {
        try {
            Pizza newPizza = pizzaRepository.save(pizza);
            return new ResponseEntity<>(newPizza, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update pizza
    @PutMapping("/{id}")
    public ResponseEntity<Pizza> updatePizza(@PathVariable Long id, @RequestBody Pizza pizza) {
        return pizzaRepository.findById(id)
                .map(existingPizza -> {
                    existingPizza.setNome(pizza.getNome());
                    existingPizza.setDescricao(pizza.getDescricao());
                    existingPizza.setPreco(pizza.getPreco());
                    Pizza updatedPizza = pizzaRepository.save(existingPizza);
                    return new ResponseEntity<>(updatedPizza, HttpStatus.OK);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete pizza
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePizza(@PathVariable Long id) {
        try {
            if (!pizzaRepository.existsById(id)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            pizzaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}