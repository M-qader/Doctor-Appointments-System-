package Final_Project.Doctor_Appointment.Patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/patients")
public class PatientsController {

    @Autowired
    private PatientsService patientsService;

    @GetMapping
    public List<PatientsModel> getAllPatients() {
        return patientsService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientsModel getPatient(@PathVariable Long id) {
        return patientsService.getPatientById(id);
    }

    @PostMapping
    public ResponseEntity<PatientsModel> create(@RequestBody PatientsModel patient) {
        PatientsModel saved = patientsService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public PatientsModel update(@PathVariable Long id, @RequestBody PatientsModel patient) {
        return patientsService.updatePatient(id, patient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientsService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
