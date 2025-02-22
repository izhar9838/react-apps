package sm.central.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sm.central.model.Student;

public interface IStudentRepo extends JpaRepository<Student, Integer> {

}
