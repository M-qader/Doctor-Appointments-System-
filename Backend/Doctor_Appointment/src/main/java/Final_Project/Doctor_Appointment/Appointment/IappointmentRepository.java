package Final_Project.Doctor_Appointment.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IappointmentRepository extends JpaRepository<AppointmentModel, Long> {

//    // Tusaale: Raadi Appointment iyadoo la raacayo doctorId iyo patientId
//    List<AppointmentModel> findByDoctor_DoctorIdAndPatient_PatientId(Long doctorId, Long patientId);
//
//    // Tusaale kale: Raadi dhammaan appointments ee status-kooda ay yihiin "Pending"
//    List<AppointmentModel> findByStatus(String status);
}
