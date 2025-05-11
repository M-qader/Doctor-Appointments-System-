package Final_Project.Doctor_Appointment.Payments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentsModel> createPayment(@RequestBody PaymentsModel payment) {
        PaymentsModel saved = paymentService.createPayment(payment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<PaymentsModel> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentsModel> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentsModel> updatePayment(@PathVariable Long id, @RequestBody PaymentsModel payment) {
        PaymentsModel updatedPayment = paymentService.updatePayment(id, payment);

        return ResponseEntity.ok(updatedPayment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
