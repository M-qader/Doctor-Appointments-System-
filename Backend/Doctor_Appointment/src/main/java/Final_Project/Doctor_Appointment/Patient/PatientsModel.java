package Final_Project.Doctor_Appointment.Patient;

import Final_Project.Doctor_Appointment.Appointment.AppointmentModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.security.PrivateKey;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;


@Entity
@Data
@Table(name = "Patients_tb")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PatientsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dob;
    @Column(name = "balance", columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private Double balance = 0.0;  // New column to store balance
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "patient")
    @JsonIgnore
    private List<AppointmentModel> appointments;

    @Transient
    public Integer getAge() {
        if (this.dob == null) return null;
        return Period.between(this.dob, LocalDate.now()).getYears();
    }

    /// /// Getter and Setter

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {return phone; }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
