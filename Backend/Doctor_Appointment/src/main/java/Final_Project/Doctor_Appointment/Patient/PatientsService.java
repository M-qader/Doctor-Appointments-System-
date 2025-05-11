package Final_Project.Doctor_Appointment.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientsService {

    @Autowired
    private IpatientsRepository ipatientsRepository;

    public List<PatientsModel> getAllPatients() {
        return ipatientsRepository.findAll();
    }

    public PatientsModel getPatientById(Long id) {
        return ipatientsRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Patient not found"));
    }

    public PatientsModel createPatient(PatientsModel patient) {
        patient.setCreatedAt(LocalDateTime.now());
        return ipatientsRepository.save(patient);
    }

    public PatientsModel updatePatient(Long id, PatientsModel updatedPatient) {
        PatientsModel existing = getPatientById(id);
        existing.setFullName(updatedPatient.getFullName());
        existing.setEmail(updatedPatient.getEmail());
        existing.setPhone(updatedPatient.getPhone());
        existing.setGender(updatedPatient.getGender());
        existing.setDob(updatedPatient.getDob());

        return ipatientsRepository.save(existing);
    }

    public void deletePatient(Long id) {
        ipatientsRepository.deleteById(id);
    }
}
