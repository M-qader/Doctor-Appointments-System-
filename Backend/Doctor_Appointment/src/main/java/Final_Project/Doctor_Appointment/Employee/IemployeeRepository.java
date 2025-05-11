package Final_Project.Doctor_Appointment.Employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IemployeeRepository extends JpaRepository<EmployeeModel, Long> {

}

