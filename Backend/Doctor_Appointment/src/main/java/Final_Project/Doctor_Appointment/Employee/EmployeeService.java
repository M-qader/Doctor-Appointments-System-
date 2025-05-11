package Final_Project.Doctor_Appointment.Employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private IemployeeRepository employeeRepository;

    public List<EmployeeModel> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<EmployeeModel> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public EmployeeModel createEmployee(EmployeeModel employee) {
        employee.setCreatedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    public EmployeeModel updateEmployee(Long id, EmployeeModel updatedEmployee) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setUsername(updatedEmployee.getUsername());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setFullName(updatedEmployee.getFullName());
            employee.setPassword_Hash(updatedEmployee.getPassword_Hash());
            employee.setRole(updatedEmployee.getRole());
            employee.setPhone(updatedEmployee.getPhone());
            employee.setActive(updatedEmployee.getActive());
            employee.setUpdatedAt(LocalDateTime.now());
            return employeeRepository.save(employee);
        }).orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
