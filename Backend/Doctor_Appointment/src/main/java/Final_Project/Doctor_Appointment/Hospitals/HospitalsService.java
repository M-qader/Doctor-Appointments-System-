package Final_Project.Doctor_Appointment.Hospitals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalsService {

    @Autowired
    private IhospitalsRepository hospitalsRepository;

    public List<HospitalsModel> getAllHospitals() {
        return hospitalsRepository.findAll();
    }

    public Optional<HospitalsModel> getHospitalById(long clinic_id) {
        return hospitalsRepository.findById(clinic_id);
    }

    public HospitalsModel saveHospital(HospitalsModel hospital) {
        hospital.setCreatedAt(java.time.LocalDateTime.now());
        return hospitalsRepository.save(hospital);
    }

    public void deleteHospital(long clinic_id) {
        hospitalsRepository.deleteById(clinic_id);
    }

    public HospitalsModel updateHospital(long clinic_id, HospitalsModel hospitalDetails) {
        HospitalsModel hospital = hospitalsRepository.findById(clinic_id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        hospital.setName(hospitalDetails.getName());
        hospital.setAddress(hospitalDetails.getAddress());
        hospital.setShortNumber(hospitalDetails.getShortNumber());
        hospital.setCity(hospitalDetails.getCity());
        hospital.setStatus(hospitalDetails.isStatus());
        return hospitalsRepository.save(hospital);
    }


}
