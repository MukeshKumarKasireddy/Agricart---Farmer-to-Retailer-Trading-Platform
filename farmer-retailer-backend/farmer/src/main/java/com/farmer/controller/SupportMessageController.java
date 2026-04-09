package com.farmer.controller;

import com.farmer.entity.SupportMessage;
import com.farmer.service.SupportMessageService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:5173")
public class SupportMessageController {

    private final SupportMessageService supportService;

    public SupportMessageController(SupportMessageService supportService) {
        this.supportService = supportService;
    }

    /* ================= USER SEND ================= */
    @PostMapping
    public SupportMessage send(@RequestBody Map<String,String> body) {
        return supportService.sendMessage(
                body.get("subject"),
                body.get("message")
        );
    }

    /* ================= USER VIEW ================= */
    @GetMapping("/my")
    public List<SupportMessage> myMessages() {
        return supportService.myMessages();
    }

    /* ================= ADMIN VIEW ALL ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<SupportMessage> all() {
        return supportService.allMessages();
    }

    /* ================= ADMIN REPLY ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reply")
    public SupportMessage reply(
            @PathVariable Long id,
            @RequestBody Map<String,String> body
    ) {
        return supportService.reply(id, body.get("message"));
    }

    /* ================= ADMIN MARK RESOLVED ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/resolve")
    public void resolve(@PathVariable Long id) {
        supportService.markResolved(id);
    }

    /* ================= ADMIN MARK READ ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        supportService.markRead(id);
    }

    /* ================= BADGE COUNT ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/unread-count")
    public Map<String,Long> unreadCount() {
        return Map.of(
                "count",
                supportService.unreadCount()
        );
    }

    /* ================= OPEN TICKETS COUNT ================= */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/open-count")
    public Map<String,Long> openCount() {
        return Map.of(
                "count",
                supportService.countOpenMessages()
        );
    }
}
