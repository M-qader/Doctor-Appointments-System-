package Final_Project.Doctor_Appointment.Doctors;

import Final_Project.Doctor_Appointment.FileStorageService;
import Final_Project.Doctor_Appointment.Hospitals.HospitalsModel;
import Final_Project.Doctor_Appointment.Hospitals.IhospitalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private IhospitalsRepository hospitalRepository;

    // Get all doctors
    @GetMapping
    public List<DoctorModel> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // Get a doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorModel> getDoctorById(@PathVariable Long id) {
        Optional<DoctorModel> doctor = doctorService.getDoctorById(id);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(doctor.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<DoctorModel> createDoctor(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("specialization") String specialization,
            @RequestParam("timeslot") String timeslot,
            @RequestParam("consultationFee") Double consultationFee,
            @RequestParam("experienceYears") int experienceYears,
            @RequestParam("gender") String gender,
            @RequestParam("hospital_id") Long hospitalId,
            @RequestParam("status") Boolean status,
            @RequestParam("file") MultipartFile file)
    {
        DoctorModel doctor = new DoctorModel();
        doctor.setFullName(fullName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setTimeslot(timeslot);
        doctor.setConsultationFee(consultationFee);
        doctor.setExperienceYears(experienceYears);
        doctor.setGender(gender);
        doctor.setStatus(status);

        // Save image
        String imagePath = fileStorageService.saveFile(file);
        if (imagePath == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // Save only the file name, not the full URL
        doctor.setProfileImageUrl(imagePath); // Save just the filename

        // Link hospital
        HospitalsModel hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        doctor.setHospital(hospital);


        // Save Doctor
        DoctorModel savedDoctor = doctorService.addDoctor(doctor);
        return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
    }

    // Update a doctor
    @PutMapping("/{id}")
    public ResponseEntity<DoctorModel> updateDoctor(
            @PathVariable Long id,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("specialization") String specialization,
            @RequestParam("timeslot") String timeslot,
            @RequestParam("consultationFee") Double consultationFee,
            @RequestParam("experienceYears") int experienceYears,
            @RequestParam("gender") String gender,
            @RequestParam("hospital_id") Long hospitalId,
            @RequestParam("status") Boolean status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Optional<DoctorModel> doctorOpt = doctorService.getDoctorById(id);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        DoctorModel doctor = doctorOpt.get();
        doctor.setFullName(fullName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setTimeslot(timeslot);
        doctor.setConsultationFee(consultationFee);
        doctor.setExperienceYears(experienceYears);
        doctor.setGender(gender);
        doctor.setStatus(status);

        // update hospital
        HospitalsModel hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        doctor.setHospital(hospital);

        // update image if a new one is uploaded
        if (file != null && !file.isEmpty()) {
            String imagePath = fileStorageService.saveFile(file);
            doctor.setProfileImageUrl(imagePath);
        }

        DoctorModel updatedDoctor = doctorService.addDoctor(doctor); // use save
        return ResponseEntity.ok(updatedDoctor);
    }


    // Delete a doctor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
