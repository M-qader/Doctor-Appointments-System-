package Final_Project.Doctor_Appointment.Payments;

import Final_Project.Doctor_Appointment.Appointment.AppointmentModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments_tb")
@NoArgsConstructor
public class PaymentsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Xiriir la leh Appointment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AppointmentModel appointment;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 3)
    private String currency; // e.g. "USD", "SOS"

    @Column(nullable = false)
    private String method; // e.g. "Cash", "Credit", "Mobile"

    private String reference;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime paidAt;


    ///  Getter and Settter
    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public AppointmentModel getAppointment() {
        return appointment;
    }

    public void setAppointment(AppointmentModel appointment) {
        this.appointment = appointment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
