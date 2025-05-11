package Final_Project.Doctor_Appointment.Payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IpaymentsRepository extends JpaRepository<PaymentsModel, Long> {
}
