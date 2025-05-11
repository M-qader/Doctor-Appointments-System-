package Final_Project.Doctor_Appointment.Hospitals;

import Final_Project.Doctor_Appointment.Doctors.DoctorModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "Hospitals_tb")
public class HospitalsModel {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long clinic_id;
    private String name;
    private String address;
    private String ShortNumber;
    private String city;
    private boolean status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DoctorModel> doctors;

    // Getters and Setters halkan ayaa la raacin karaa


    public Long getClinic_id() {
        return clinic_id;
    }

    public void setClinic_id(Long clinic_id) {
        this.clinic_id = clinic_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getShortNumber() {
        return ShortNumber;
    }

    public void setShortNumber(String shortNumber) {
        ShortNumber = shortNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
