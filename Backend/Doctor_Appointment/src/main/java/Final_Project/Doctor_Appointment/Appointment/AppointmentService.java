package Final_Project.Doctor_Appointment.Appointment;

import Final_Project.Doctor_Appointment.Doctors.DoctorModel;
import Final_Project.Doctor_Appointment.Doctors.IdoctorRepository;
import Final_Project.Doctor_Appointment.Patient.IpatientsRepository;
import Final_Project.Doctor_Appointment.Patient.PatientsModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private IappointmentRepository appointmentRepository;

    @Autowired
    private IpatientsRepository patientsRepository;

    @Autowired
    private IdoctorRepository doctorRepository;

    // Raadi appointment iyadoo loo marayo appointmentId
    public Optional<AppointmentModel> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    // Hel dhammaan appointments
    public List<AppointmentModel> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Samee ama cusbooneysii Appointment
    @Transactional
    public AppointmentModel createOrUpdateAppointment(AppointmentModel appointment) {
        // Validate doctor and patient exist
        PatientsModel patient = patientsRepository.findById(appointment.getPatient().getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DoctorModel doctor = doctorRepository.findById(appointment.getDoctor().getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Set Patient and Doctor
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        appointment.setBookedAt(LocalDateTime.now()); // Set booking time
        return appointmentRepository.save(appointment);
    }

    // Tirtir appointment
    @Transactional
    public void deleteAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    // Cancel appointment (safe, does not delete)
    public void cancelAppointment(Long id) {
        AppointmentModel appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointment.setCanceledAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    public void completeAppointment(Long id) {
        AppointmentModel appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getCompletedAt() != null) {
            throw new RuntimeException("Appointment already completed");
        }

        appointment.setCompletedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }


}

