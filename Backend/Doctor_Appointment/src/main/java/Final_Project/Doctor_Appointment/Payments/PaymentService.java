package Final_Project.Doctor_Appointment.Payments;

import Final_Project.Doctor_Appointment.Appointment.AppointmentModel;
import Final_Project.Doctor_Appointment.Appointment.IappointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private IpaymentsRepository paymentsRepository;

    @Autowired
    private IappointmentRepository appointmentRepository;

    public String generateNextReference() {
        long count = paymentsRepository.count();
        return String.format("REF%04d", count + 1);
    }

    public PaymentsModel createPayment(PaymentsModel payment) {
        if (payment.getAppointment() == null || payment.getAppointment().getAppointmentId() == null) {
            throw new IllegalArgumentException("Appointment ID must not be null");
        }

        Long appointmentId = payment.getAppointment().getAppointmentId();
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        payment.setAppointment(appointment);
        payment.setReference(generateNextReference());
        payment.setPaidAt(LocalDateTime.now());

        return paymentsRepository.save(payment);
    }

    public PaymentsModel updatePayment(Long id, PaymentsModel updatedPayment) {
        PaymentsModel existing = paymentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Update only allowed fields
        existing.setAmount(updatedPayment.getAmount());
        existing.setMethod(updatedPayment.getMethod());

        // If appointment is sent, update it as well
        if (updatedPayment.getAppointment() != null && updatedPayment.getAppointment().getAppointmentId() != null) {
            AppointmentModel newAppointment = appointmentRepository.findById(updatedPayment.getAppointment().getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            existing.setAppointment(newAppointment);
        }

        return paymentsRepository.save(existing);
    }



    public List<PaymentsModel> getAllPayments() {
        return paymentsRepository.findAll();
    }

    public Optional<PaymentsModel> getPaymentById(Long id) {
        return paymentsRepository.findById(id);
    }

    public void deletePayment(Long id) {
        paymentsRepository.deleteById(id);
    }
}
