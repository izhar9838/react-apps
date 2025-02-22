package sm.central.security.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseData implements Serializable{

	private static final long serialVersionUID = 1L;
	private UserEntity user;
	private String token;

}
