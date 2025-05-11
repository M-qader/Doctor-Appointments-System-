package Final_Project.Doctor_Appointment.Hospitals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/hospitals")
public class HospitalsController {

    @Autowired
    private HospitalsService hospitalsService;

    @GetMapping
    public List<HospitalsModel> getAllHospitals() {
        return hospitalsService.getAllHospitals();
    }

    @GetMapping("/{id}")
    public Optional<HospitalsModel> getHospitalById(@PathVariable int id) {
        return hospitalsService.getHospitalById(id);
    }

    @PostMapping
    public HospitalsModel createHospital(@RequestBody HospitalsModel hospital) {
        return hospitalsService.saveHospital(hospital);
    }

    @PutMapping("/{id}")
    public HospitalsModel updateHospital(@PathVariable int id, @RequestBody HospitalsModel hospital) {
        return hospitalsService.updateHospital(id, hospital);
    }

    @DeleteMapping("/{id}")
    public void deleteHospital(@PathVariable int id) {
        hospitalsService.deleteHospital(id);
    }

}
