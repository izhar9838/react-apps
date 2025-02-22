package sm.central.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sm.central.model.Contact_Info;

public interface IContactInfoRepo extends JpaRepository<Contact_Info, Integer> {

}
