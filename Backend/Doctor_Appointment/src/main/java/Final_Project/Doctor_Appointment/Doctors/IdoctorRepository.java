package Final_Project.Doctor_Appointment.Doctors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdoctorRepository extends JpaRepository<DoctorModel, Long> {

}
