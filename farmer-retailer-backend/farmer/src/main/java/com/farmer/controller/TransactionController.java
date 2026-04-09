package com.farmer.controller;

import com.farmer.entity.Transaction;
import com.farmer.entity.User;
import com.farmer.repository.TransactionRepository;
import com.farmer.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/retailer")
    public List<Transaction> getRetailerTransactions() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User retailer = userRepository.findByEmail(email)
                .orElseThrow();

        return transactionRepository.findByRetailerId(retailer.getId());
    }
}
