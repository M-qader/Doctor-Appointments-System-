package Final_Project.Doctor_Appointment;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    // Define the upload directory path
    private final String uploadDir = System.getProperty("user.dir") + File.separator + "static" + File.separator + "uploads";
    // Change as needed


    public String saveFile(MultipartFile file) {
        try {
            // Create the directory if it doesn't exist
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // Create the directory if it doesn't exist
            }

            // Create a unique filename
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + File.separator + fileName;

            // Save the file to the disk
            Files.copy(file.getInputStream(), Paths.get(filePath));

            // Return only the file name (no full URL)
            return fileName; // Return the filename for storage in the database
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}