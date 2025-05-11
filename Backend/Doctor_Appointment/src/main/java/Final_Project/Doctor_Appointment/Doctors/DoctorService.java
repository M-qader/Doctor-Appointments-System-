package Final_Project.Doctor_Appointment.Doctors;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private IdoctorRepository doctorRepository;

    // Get all doctors
    public List<DoctorModel> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get a single doctor by id
    public Optional<DoctorModel> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // Add a new doctor
    public DoctorModel addDoctor(DoctorModel doctor) {
        doctor.setCreatedAt(java.time.LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    // Update a doctor
    public DoctorModel updateDoctor(Long id, DoctorModel doctorDetails) {
        Optional<DoctorModel> doctorOpt = doctorRepository.findById(id);
        if (doctorOpt.isPresent()) {
            DoctorModel doctor = doctorOpt.get();
            doctor.setFullName(doctorDetails.getFullName());
            doctor.setEmail(doctorDetails.getEmail());
            doctor.setPhone(doctorDetails.getPhone());
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setTimeslot(doctorDetails.getTimeslot());
            doctor.setConsultationFee((doctorDetails.getConsultationFee()));
            doctor.setExperienceYears(doctorDetails.getExperienceYears());
            doctor.setGender(doctorDetails.getGender());
            doctor.setStatus(doctorDetails.getStatus());
            doctor.setProfileImageUrl(doctorDetails.getProfileImageUrl());
            doctor.setHospital(doctorDetails.getHospital());
            return doctorRepository.save(doctor);
        } else {
            return null; // Doctor not found
        }
    }

    // Delete a doctor
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
