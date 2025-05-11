package Final_Project.Doctor_Appointment.Patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IpatientsRepository extends JpaRepository<PatientsModel, Long> {
}
