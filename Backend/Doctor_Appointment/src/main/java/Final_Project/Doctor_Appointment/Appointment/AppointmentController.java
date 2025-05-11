package Final_Project.Doctor_Appointment.Appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments") // ✅ This is important
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Hel dhammaan appointments
    @GetMapping
    public ResponseEntity<List<AppointmentModel>> getAllAppointments() {
        List<AppointmentModel> appointments = appointmentService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    // Hel appointment gaar ah iyadoo loo marayo appointmentId
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentModel> getAppointmentById(@PathVariable("id") Long id) {
        Optional<AppointmentModel> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent()) {
            return new ResponseEntity<>(appointment.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<AppointmentModel> createAppointment(@RequestBody AppointmentModel appointment) {
        AppointmentModel savedAppointment = appointmentService.createOrUpdateAppointment(appointment);
        return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
    }


    // Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentModel> updateAppointment(@PathVariable("id") Long id, @RequestBody AppointmentModel appointment) {
        Optional<AppointmentModel> existingAppointment = appointmentService.getAppointmentById(id);
        if (existingAppointment.isPresent()) {
            appointment.setAppointmentId(id);  // Set the existing appointmentId
            AppointmentModel updatedAppointment = appointmentService.createOrUpdateAppointment(appointment);
            return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // Tirtir appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable("id") Long id) {
        Optional<AppointmentModel> existingAppointment = appointmentService.getAppointmentById(id);
        if (existingAppointment.isPresent()) {
            appointmentService.deleteAppointment(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok("Appointment canceled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id) {
        try {
            appointmentService.completeAppointment(id);
            return ResponseEntity.ok("Appointment completed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
