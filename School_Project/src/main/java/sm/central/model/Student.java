package sm.central.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CurrentTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Student implements Serializable{
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Integer studentId;
	private String firstName;
	private String lastname;
	private Date dob;
	private String gender;
	private String admissionId;
	@CurrentTimestamp
	private Date admissionDate;
	
	@OneToOne(mappedBy = "student",cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
	private Contact_Info contact_info;
	
	@OneToOne(mappedBy = "student",cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
	private Academic_Info academic_info;
	@OneToMany(mappedBy = "student" ,cascade = CascadeType.ALL,fetch = FetchType.LAZY ,orphanRemoval = true)
	
	private List<Fees_Details> fees_details;
	private byte [] image;
	
	
	


	public void setAcademic_info(Academic_Info academic_info) {
		if (academic_info==null) {
			if(this.academic_info!=null) {
				this.academic_info.setStudent(null);
			}
			
		} else {

		}
		this.academic_info = academic_info;
	}


	public void setContact_info(Contact_Info contact_info) {
			if (contact_info==null) {
				if (this.contact_info!=null) {
					this.contact_info.setStudent(null);
				}
			} else {
				contact_info.setStudent(this);
			}
			this.contact_info=contact_info;
	}
}
