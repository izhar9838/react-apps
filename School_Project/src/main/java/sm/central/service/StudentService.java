package sm.central.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sm.central.model.Student;
import sm.central.repository.IContactInfoRepo;
import sm.central.repository.IFeesRepo;
import sm.central.repository.IStudentRepo;
@Service
public class StudentService implements IStudentService {
	@Autowired
	private IStudentRepo sturepo;
	@Autowired
	private IContactInfoRepo contrepo;
	@Autowired
	private IFeesRepo feerepo;
	@Override
	public Student enrollStudent(Student student) {
		if(student!=null) {
			Student stu = sturepo.save(student);
			if (stu!=null) {
				return stu;
			}
			
		}
		return null;
	}

}
