package sm.central.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sm.central.model.Fees_Details;

public interface IFeesRepo extends JpaRepository<Fees_Details, Integer> {

}
